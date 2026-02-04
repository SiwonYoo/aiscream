'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new Error('로그인이 필요합니다.');
  }

  return { user, supabase };
}
