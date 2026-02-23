import { buildAuthorizeUrl, getNotionEnv } from '@/lib/notion';
import { NextResponse } from 'next/server';

/**
 * /api/notion/connect
 *
 * 역할:
 * - 유저를 Notion OAuth 동의 화면으로 이동시킴
 * - DB 작업 없음
 */
export async function GET() {
  try {
    // env 가져오기
    const { clientId, redirectUri } = getNotionEnv();

    // Notion authorize URL 생성
    const url = buildAuthorizeUrl(clientId, redirectUri);

    // Notion으로 redirect
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('[Notion Connect Error]', error);

    // env 문제 등 발생 시 안전하게 복귀
    return NextResponse.redirect(new URL('/post?notion=connect_failed', process.env.NEXT_PUBLIC_SITE_URL));
  }
}
