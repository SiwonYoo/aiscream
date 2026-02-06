'use client';

import { useState } from 'react';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import { supabase } from '@/lib/supabaseClient';

const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';

  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getURL()}auth/callback`,
      },
    });

    if (error) {
      console.error('Google 로그인 실패:', error.message);
      alert('Google 로그인 실패: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-10 space-y-5 rounded-xl border border-base-stroke bg-white p-5 md:p-7">
      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] font-bold text-black md:text-[22px]">로그인</h2>
        <p className="text-sm text-secondary">계정에 로그인하여 블로그 글 생성을 시작하세요.</p>
      </div>

      <form className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black md:text-base" htmlFor="email">
              이메일
            </label>
            <input id="email" type="email" placeholder="이메일을 입력하세요." className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black md:text-base" htmlFor="password">
              비밀번호
            </label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요." className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]" />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-2 md:gap-0">
          <button type="button" className="h-7.5 cursor-pointer rounded-sm bg-black p-1 text-sm font-semibold text-white md:h-10 md:text-base">
            로그인
          </button>

          <div className="flex justify-start md:justify-end">
            <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />
          </div>
        </div>
      </form>
    </section>
  );
}
