'use server';

import { getAuthenticatedUser } from '@/lib/auth';
import { Post } from '@/types/post';

/**
 * [READ] 글 조회
 */
export async function getPostById(postId: string) {
  const { supabase, user } = await getAuthenticatedUser();

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

/**
 * [READ] 내 글 전체 조회
 */
export async function getMyPosts() {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase.from('posts').select('*').eq('author_id', user.id).order('created_at', { ascending: false });

  if (error) throw error;
  if (!data) return [];

  const posts: Post[] = data.map(row => ({
    id: row.id,
    authorId: row.author_id,
    topic: row.topic,
    keywords: row.keywords,
    type: row.type,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return posts;
}
