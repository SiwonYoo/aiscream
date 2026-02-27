import { create } from 'zustand';

type PostStore = {
  selectedPostId: string | null;
  selectPostId: (id: string) => void;
  clearSelected: () => void;
  isChanged: boolean;
  setIsChanged: (v: boolean) => void;
};

export const usePostStore = create<PostStore>(set => ({
  selectedPostId: null,
  isChanged: false,
  selectPostId: id => set({ selectedPostId: id }),
  clearSelected: () => set({ selectedPostId: null }),
  setIsChanged: v => set({ isChanged: v }),
}));
