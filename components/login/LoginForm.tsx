'use client';

import { useState } from 'react';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import { useAuth } from '@/app/hooks/useAuth';

export default function LoginForm() {
  const { isLoading, errorMessage, loginWithGoogle, loginWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <section className="mt-10 space-y-5 rounded-xl border border-base-stroke bg-white p-5 md:p-7">
      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] font-bold text-black md:text-[22px]">로그인</h2>
        <p className="text-sm text-secondary">계정에 로그인하여 블로그 글 생성을 시작하세요.</p>
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <form className="flex flex-col gap-5" onSubmit={e => e.preventDefault()}>
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black md:text-base" htmlFor="email">
              이메일
            </label>
            <input id="email" type="email" placeholder="이메일을 입력하세요." className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black md:text-base" htmlFor="password">
              비밀번호
            </label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요." className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-2 md:gap-0">
          <button type="button" onClick={() => loginWithEmail(email, password, '/post')} disabled={isLoading} className="h-7.5 cursor-pointer rounded-sm bg-black p-1 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-base">
            로그인
          </button>

          <div className="flex justify-start md:justify-end">
            <GoogleLoginButton onClick={() => loginWithGoogle('/post')} disabled={isLoading} />
          </div>
        </div>
      </form>
    </section>
  );
}
