/**
 * Notion OAuth에 필요한 환경변수 가져오기
 * - connect / callback 둘 다 사용
 */
export function getNotionEnv() {
  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const redirectUri = process.env.NOTION_REDIRECT_URI;

  // env 체크
  if (!clientId || !redirectUri) {
    throw new Error('[Notion] 환경변수가 설정되지 않았습니다.');
  }

  return { clientId, clientSecret, redirectUri };
}

/**
 * Notion 동의(OAuth) 페이지 URL 생성
 * 유저를 Notion 권한 허용 화면으로 보낼 때 사용
 */
export function buildAuthorizeUrl(clientId: string, redirectUri: string) {
  return `https://api.notion.com/v1/oauth/authorize` + `?client_id=${encodeURIComponent(clientId)}` + `&response_type=code` + `&owner=user` + `&redirect_uri=${encodeURIComponent(redirectUri)}`;
}

/**
 * Notion에서 받은 code으로 access_token 교환
 * callback route에서만 사용
 */
export async function exchangeCodeForToken(code: string, clientId: string, clientSecret: string, redirectUri: string) {
  // Basic Auth 생성
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  // 실패 응답이면 내용 출력 후 에러
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[Notion OAuth Failed] ${text}`);
  }

  return JSON.parse(text);
}
