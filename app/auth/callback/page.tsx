'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

async function upsertProfile() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const user = data.user;
  if (!user) return;
  const nickname = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'user';
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const { error: upsertError } = await supabase.from('profiles').upsert({
    id: user.id,
    nickname,
    avatar_url: avatarUrl,
  });

  if (upsertError) throw upsertError;
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await upsertProfile();
      } finally {
        router.replace('/');
      }
    })();
  }, [router]);

  return <div className="p-6">로그인 처리 중…</div>;
}
