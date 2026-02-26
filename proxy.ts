// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 응답 객체
  let response = NextResponse.next({ request });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // 세션 확인 (없으면 null)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = pathname === '/login';
  const isProtected = pathname.startsWith('/post');

  // /login 접근: 이미 로그인 상태면 /post로
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/post';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // 보호 라우트 접근: 로그인 안 되어 있으면 /login으로
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // 돌아갈 경로 보관(옵션)
    url.searchParams.set('next', pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''));
    return NextResponse.redirect(url);
  }

  return response;
}

// 필요한 라우트만 미들웨어 적용
export const config = {
  matcher: ['/login', '/post/:path*'],
};
