'use server';

import { createClient } from '@/lib/supabaseServer';
import { CreatePostInput, Post } from '@/types/post';

/**
 * 블로그 글 저장
 */
export async function savePost(post: CreatePostInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        author_id: user.id,
        topic: post.topic,
        keywords: post.keywords,
        title: post.title,
        content: post.content,
        type: post.type,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return { success: true, post: data };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { error } = await supabase.from('posts').delete().eq('author_id', user.id).eq('id', postId);

  if (error) throw error;

  return { success: true };
}
