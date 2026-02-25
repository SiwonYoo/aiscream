import { buildAuthorizeUrl, getNotionEnv } from '@/lib/notion';
import { createClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

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

/**
 * /api/notion/connect
 *
 * 역할:
 * - 유저를 Notion OAuth 동의 화면으로 이동시킴
 * - DB 작업 없음
 */
export async function GET(req: Request) {
  const requestUrl = new URL(req.url);

  // 클라에서 넘어오는 값들
  const installId = requestUrl.searchParams.get('install_id') ?? ''; // 데모 기기 식별용
  const returnTo = safeReturnTo(requestUrl.searchParams.get('return_to'));
  const resume = getResume(requestUrl.searchParams.get('resume'));

  // 서버에서 로그인 유저 확인
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(new URL('/login?error=login_required', requestUrl.origin));
  }

  // state 생성
  const state = globalThis.crypto?.randomUUID?.() ?? `st_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;

  // DB에 임시 저장 (10분 만료)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error: insErr } = await supabase.from('notion_oauth_states').insert({
    state,
    user_id: user.id,
    demo_install_id: installId || '',
    return_to: returnTo,
    resume,
    expires_at: expiresAt,
  });

  if (insErr) {
    console.error('[Notion Connect] state insert failed', insErr);
    return NextResponse.redirect(new URL('/post?notion=connect_failed', requestUrl.origin));
  }

  // authorize URL 생성 + state 붙이기
  const { clientId, redirectUri } = getNotionEnv();
  const authUrl = new URL(buildAuthorizeUrl(clientId, redirectUri));
  authUrl.searchParams.set('state', state);

  return NextResponse.redirect(authUrl);
}
