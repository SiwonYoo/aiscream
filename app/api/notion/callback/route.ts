import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { exchangeCodeForToken, getNotionEnv } from '@/lib/notion';

/**
 * /api/notion/callback
 *
 * 흐름:
 * 1. Notion이 code(+state)를 붙여서 여기로 돌아옴
 * 2. state로 notion_oauth_states에서 (user_id, demo_install_id, return_to, resume, expires_at) 조회
 * 3. code → access_token 교환
 * 4. Supabase notion_connections 저장
 * 5. 원래 화면(return_to)으로 redirect
 */
function isDemoUser(email?: string | null) {
  return email === 'demo@aiscream.com';
}

function safeReturnTo(v: string | null): string {
  const fallback = '/post';
  if (!v) return fallback;
  if (!v.startsWith('/')) return fallback;
  if (v.startsWith('//')) return fallback;
  return v;
}

function getResume(v: string | null): string {
  return v?.trim() || 'notion_pick';
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  // Notion이 전달한 code/state 받기
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    // 사용자가 직접 접근했거나 OAuth 실패로 code가 없는 경우
    return NextResponse.redirect(new URL('/post?notion=missing_code', url.origin));
  }

  if (!state) {
    // state가 없으면 connect에서 차단
    return NextResponse.redirect(new URL('/post?notion=missing_state', url.origin));
  }

  // Supabase 클라이언트
  const supabase = await createClient();

  /**
   * connect에서 저장해둔 state 조회
   * - expires_at 만료되었으면 실패 처리
   */
  const { data: st, error: stErr } = await supabase.from('notion_oauth_states').select('user_id, demo_install_id, return_to, resume, expires_at').eq('state', state).maybeSingle();

  if (stErr) {
    console.error('[Notion state lookup error]', stErr);
    return NextResponse.redirect(new URL('/post?notion=state_db_error', url.origin));
  }

  if (!st) {
    return NextResponse.redirect(new URL('/post?notion=invalid_state', url.origin));
  }

  if (st.expires_at && new Date(st.expires_at).getTime() < Date.now()) {
    return NextResponse.redirect(new URL('/post?notion=state_expired', url.origin));
  }

  // return_to / resume
  const returnTo = safeReturnTo((st as any).return_to ?? null);
  const resume = getResume((st as any).resume ?? null);

  // state에 매핑 user_id
  const stateUserId = (st as any).user_id as string;

  /**
   * 보안/정합성 체크
   *
   */
  const { data: u, error: userError } = await supabase.auth.getUser();
  if (userError || !u.user) {
    return NextResponse.redirect(new URL('/login?error=login_required', url.origin));
  }
  if (u.user.id !== stateUserId) {
    // 다른 유저 세션으로 callback을 맞았으면 차단
    return NextResponse.redirect(new URL('/post?notion=user_mismatch', url.origin));
  }

  // Notion token 교환
  const { clientId, clientSecret, redirectUri } = getNotionEnv();

  let tokenData;
  try {
    tokenData = await exchangeCodeForToken(code, clientId, clientSecret!, redirectUri);
  } catch (error) {
    console.error('[Notion token exchange error]', error);
    return NextResponse.redirect(new URL(`${returnTo}?notion=oauth_failed`, url.origin));
  }

  // access_token 존재 여부 체크
  if (!tokenData?.access_token) {
    console.error('[Notion access_token missing]', tokenData);
    return NextResponse.redirect(new URL(`${returnTo}?notion=missing_token`, url.origin));
  }

  /**
   * demo_install_id 결정
   * connect에서 state 테이블에 꺼내서 사용한다
   *
   */
  const demoInstallId = ((st as any).demo_install_id as string) ?? '';

  // demo 유저인지 판별
  const email = u.user?.email ?? null;
  const demo = isDemoUser(email);

  if (demo && !demoInstallId) {
    // demo 모드인데 install_id가 없으면 연결 못 하게 막기
    return NextResponse.redirect(new URL(`${returnTo}?notion=missing_install_id`, url.origin));
  }

  const payload = {
    user_id: stateUserId,
    access_token: tokenData.access_token,
    workspace_id: tokenData.workspace_id ?? null,
    bot_id: tokenData.bot_id ?? null,
    updated_at: new Date().toISOString(),
    demo_install_id: demo ? demoInstallId : '',
  };

  // Supabase DB 저장
  const { error: upsertError } = await supabase.from('notion_connections').upsert(payload, { onConflict: 'user_id,demo_install_id' });

  if (upsertError) {
    console.error('[Notion DB save error]', upsertError);
    return NextResponse.redirect(new URL(`${returnTo}?notion=save_failed`, url.origin));
  }

  /**
   *  state는 1회용이니까 사용 후 제거
   */
  const { error: delErr } = await supabase.from('notion_oauth_states').delete().eq('state', state);
  if (delErr) console.warn('[Notion state delete warn]', delErr);

  // 원래 화면으로 복귀 + resume 트리거 전달
  const nextUrl = new URL(returnTo, url.origin);
  nextUrl.searchParams.set('notion', 'connected');
  nextUrl.searchParams.set('resume', resume);

  return NextResponse.redirect(nextUrl);
}
