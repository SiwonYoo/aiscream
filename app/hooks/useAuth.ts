'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';

  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

type AuthResult = { ok: true } | { ok: false; message: string };

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clearError = () => setErrorMessage('');

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!mounted) return;

      if (error) {
        setUser(null);
        return;
      }

      setUser(data.user ?? null);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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
      setErrorMessage('구글 로그인에 실패했습니다.');
      setIsLoading(false);
      return { ok: false, message: '구글 로그인에 실패했습니다.' };
    }

    setIsLoading(false);
    return { ok: true };
  };

  const loginWithEmail = async (email: string, password: string, nextPath: string = '/post'): Promise<AuthResult> => {
    setIsLoading(true);
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('이메일과 비밀번호를 입력해 주세요.');
      setIsLoading(false);
      return { ok: false, message: '이메일과 비밀번호를 입력해 주세요.' };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
      setIsLoading(false);
      return { ok: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    setIsLoading(false);
    router.replace(nextPath);
    return { ok: true };
  };

  const logout = async (nextPath: string = '/login'): Promise<AuthResult> => {
    setIsLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage('로그아웃에 실패했습니다.');
      setIsLoading(false);
      return { ok: false, message: '로그아웃에 실패했습니다.' };
    }

    setIsLoading(false);
    router.replace(nextPath);
    return { ok: true };
  };

  return {
    user,
    isLoading,
    errorMessage,
    clearError,
    loginWithGoogle,
    loginWithEmail,
    logout,
  };
}
