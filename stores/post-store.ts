import { create } from 'zustand';

type PostStore = {
  selectedPostId: string | null;
  selectPostId: (id: string) => void;
  clearSelected: () => void;
};

export const usePostStore = create<PostStore>(set => ({
  selectedPostId: null,
  selectPostId: id => set({ selectedPostId: id }),
  clearSelected: () => set({ selectedPostId: null }),
}));
