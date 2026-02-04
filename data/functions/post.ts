'use server';

import { createClient } from '@/lib/supabaseServer';
import { Post } from '@/types/post';

export async function getPostById(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase.from('posts').select('*').eq('author_id', user.id).eq('id', postId).single();

  // PGRST116: 데이터 없음 (정상이므로 무시)
  if (error && error.code !== 'PGRST116') throw error;

  if (!data) return null;

  const post: Post = {
    id: data.id,
    authorId: data.author_id,
    topic: data.topic,
    keywords: data.keywords,
    type: data.type,
    title: data.title,
    content: data.content,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return post;
}
