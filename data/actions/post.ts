'use server';

import { getAuthenticatedUser } from '@/lib/auth';
import { CreatePostInput } from '@/types/post';

/**
 * 블로그 글 저장
 */
export async function savePost(post: CreatePostInput) {
  const { supabase, user } = await getAuthenticatedUser();

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
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('posts').delete().eq('author_id', user.id).eq('id', postId);

  if (error) throw error;

  return { success: true };
}
