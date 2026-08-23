import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean; // 모바일 오버레이 열림 여부 (기본 false)
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  isCollapsed: boolean; // 데스크탑 사이드바 접힘 여부 (기본 false = 펼침)
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: open => set({ isSidebarOpen: open }),

  isCollapsed: false,
  toggleCollapsed: () => set(state => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: collapsed => set({ isCollapsed: collapsed }),
}));
