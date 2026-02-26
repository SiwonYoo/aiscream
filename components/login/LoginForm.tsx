'use client';

import { useState } from 'react';
import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import { useAuth } from '@/app/hooks/useAuth';

export default function LoginForm() {
  const { isLoading, errorMessage, clearError, loginWithGoogle, loginWithEmail } = useAuth();

  const [email, setEmail] = useState('demo@aiscream.com');
  const [password, setPassword] = useState('rkskekfk12');

  return (
    <section className="mt-10 space-y-5 rounded-xl border border-base-stroke bg-bg-base p-5 md:p-7">
      <div className="flex flex-col gap-2">
        <h2 className="text-[20px] font-bold text-black md:text-[22px]">로그인</h2>
        <p className="text-sm text-secondary md:text-base">계정에 로그인하여 블로그 글 생성을 시작하세요.</p>
      </div>

      <form
        noValidate
        className="flex flex-col gap-7"
        onSubmit={async e => {
          e.preventDefault();
          clearError();
          await loginWithEmail(email, password, '/post');
        }}
      >
        <div>
          <div className="flex flex-col gap-4 md:gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black md:text-base" htmlFor="email">
                이메일
              </label>
              <input
                id="email"
                type="text"
                inputMode="email"
                autoComplete="email"
                placeholder="이메일을 입력하세요."
                className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (errorMessage) clearError();
                }}
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black md:text-base" htmlFor="password">
                비밀번호
              </label>
              <input id="password" type="password" placeholder="비밀번호를 입력하세요." className="h-9 w-full rounded-sm border border-input-stroke px-2.5 text-sm text-secondary outline-none md:h-10 md:text-[14px]" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
            </div>
          </div>

          <p className={`mt-2 text-[10px] font-extralight text-red-500 transition-opacity pc:text-xs ${errorMessage ? 'block' : 'hidden'}`} aria-live="polite">
            {errorMessage || '\u00A0'}
          </p>
        </div>
        <div className="grid grid-cols-2 items-center gap-2 md:gap-0">
          <button type="submit" disabled={isLoading} className="h-7.5 cursor-pointer rounded-sm bg-black p-1 text-sm font-semibold text-white hover:bg-hover disabled:cursor-not-allowed disabled:opacity-50 md:h-10 md:text-base">
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
