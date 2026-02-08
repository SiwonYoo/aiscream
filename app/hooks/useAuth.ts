'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';

  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

type AuthResult = { ok: true } | { ok: false; message: string };

export function useAuth() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => setErrorMessage('');

  const loginWithGoogle = async (nextPath: string = '/post'): Promise<AuthResult> => {
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getURL()}auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    if (error) {
      console.error('Google 로그인 실패:', error.message);
      setErrorMessage('구글 로그인에 실패했습니다.');
      setIsLoading(false);
      return { ok: false, message: '구글 로그인에 실패했습니다.' };
    }

    return { ok: true };
  };

  const loginWithEmail = async (email: string, password: string, nextPath: string = '/post'): Promise<AuthResult> => {
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('Email 로그인 실패:', error.message);
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
      return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    router.replace(nextPath);
    setIsLoading(false);
    return { ok: true };
  };

  const logout = async (nextPath: string = '/login'): Promise<AuthResult> => {
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('로그아웃 실패:', error.message);
      setErrorMessage('로그아웃에 실패했습니다.');
      setIsLoading(false);
      return { ok: false, message: '로그아웃에 실패했습니다.' };
    }

    router.replace(nextPath);
    setIsLoading(false);
    return { ok: true };
  };

  return {
    isLoading,
    errorMessage,
    clearError,
    loginWithGoogle,
    loginWithEmail,
    logout,
  };
}
