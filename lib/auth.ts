'use server';

import { createClient } from '@/lib/supabaseServer';

export async function getAuthenticatedUser() {
  const supabase = await createClient();

  // 임시 user 데이터
  const user = { id: '6226d361-ee1c-4342-9d74-ebb5ec532d40' };

  // TODO 쿠키 사용으로 수정 예정
  // const {
  //   data: { user },
  //   error,
  // } = await supabase.auth.getUser();

  // if (!user || error) {
  //   throw new Error('로그인이 필요합니다.');
  // }

  return { user, supabase };
}
