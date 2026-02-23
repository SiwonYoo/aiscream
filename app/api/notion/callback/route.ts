import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { exchangeCodeForToken, getNotionEnv } from '@/lib/notion';

/**
 * /api/notion/callback
 *
 * 흐름:
 * 1. Notion이 code를 붙여서 여기로 돌아옴
 * 2. code → access_token 교환
 * 3. Supabase notion_connections 저장
 */
export async function GET(req: Request) {
  const url = new URL(req.url);

  // Notion이 전달한 code 받기
  const code = url.searchParams.get('code');

  if (!code) {
    // 사용자가 직접 접근했거나 OAuth 실패
    return NextResponse.redirect(new URL('/post?notion=missing_code', url.origin));
  }

  // 현재 로그인 유저 확인
  const supabase = await createClient();

  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('[Supabase getUser error]', userError);
    return NextResponse.redirect(new URL('/login?error=auth_failed', url.origin));
  }

  const user = data.user;

  if (!user) {
    // 로그인 안된 상태에서 callback 접근 방지
    return NextResponse.redirect(new URL('/login?error=login_required', url.origin));
  }

  // Notion token 교환
  const { clientId, clientSecret, redirectUri } = getNotionEnv();

  let tokenData;

  try {
    tokenData = await exchangeCodeForToken(code, clientId, clientSecret!, redirectUri);
  } catch (error) {
    console.error('[Notion token exchange error]', error);

    return NextResponse.redirect(new URL('/post?notion=oauth_failed', url.origin));
  }

  // access_token 존재 여부 체크
  if (!tokenData?.access_token) {
    console.error('[Notion access_token missing]', tokenData);

    return NextResponse.redirect(new URL('/post?notion=missing_token', url.origin));
  }

  // Supabase DB 저장
  const { error: upsertError } = await supabase.from('notion_connections').upsert({
    user_id: user.id,
    access_token: tokenData.access_token,
    workspace_id: tokenData.workspace_id ?? null,
    bot_id: tokenData.bot_id ?? null,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    console.error('[Notion DB save error]', upsertError);

    return NextResponse.redirect(new URL('/post?notion=save_failed', url.origin));
  }

  return NextResponse.redirect(new URL('/post?notion=connected', url.origin));
}
