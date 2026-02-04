'use server';

import { getAuthenticatedUser } from '@/lib/auth';
import { CreatePostData, UpdatePostData } from '@/types/post';

/**
 * [CREATE] 글 저장
 */
export async function createPost(post: CreatePostData) {
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

/**
 * [UPDATE] 글 수정
 */
export async function updatePost(postId: string, post: UpdatePostData) {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase.from('posts').update(post).eq('author_id', user.id).eq('id', postId).select().single();

  if (error) throw error;

  return { success: true, post: data };
}

/**
 * [DELETE] 글 삭제
 */
export async function deletePost(postId: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('posts').delete().eq('author_id', user.id).eq('id', postId);

  if (error) throw error;

  return { success: true };
}
