import { create } from 'zustand';
import type { Post } from '@/types/post';
import { getMyPosts } from '@/data/functions/post';

type PostStore = {
  posts: Post[] | null;
  selectedPost: Post | null;

  fetchMyPosts: () => Promise<void>;
  selectPost: (post: Post) => void;
};

export const usePostStore = create<PostStore>(set => ({
  posts: null,
  selectedPost: null,

  fetchMyPosts: async () => {
    try {
      const data = await getMyPosts();
      set({ posts: data ?? [] });
    } catch (e) {
      console.error(e);
      set({ posts: [] });
    }
  },

  selectPost: post => {
    set({ selectedPost: post });
  },
}));
