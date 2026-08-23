'use client';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import type { Post } from '@/types/post';
import { usePostStore } from '@/stores/post-store';
import PlusIcon from '../common/PlusIcon';
import ThemeModeToggle from '../common/Toggle';
import { useModalStore } from '@/stores/modal-store';

export default function Sidebar({ initialPosts, userEmail }: { initialPosts: Post[]; userEmail: string }) {
  const { logout } = useAuth();
  const { isSidebarOpen, isCollapsed, toggleCollapsed } = useUIStore();
  const { selectPostId, isChanged } = usePostStore();
  const pathname = usePathname();

  const openModal = useModalStore(state => state.openModal);

  return (
    <aside id="sidebar" className={`z-10 flex w-70 flex-col self-stretch border-r border-base-stroke bg-muted text-xs transition-all duration-200 max-pc:absolute max-pc:inset-0 pc:h-dvh pc:text-sm ${isCollapsed ? 'pc:w-15.5' : 'pc:w-75'} ${isSidebarOpen ? '' : 'max-pc:w-0'}`}>
      {/* (only-PC) 사이드바 헤더 */}
      <header className={`hidden h-15.5 border-b border-base-stroke px-4 py-4.5 pc:flex ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {/* (only-PC) 로고 */}
        <Link href="/post" aria-label="AiScReam 홈으로 이동" className={`${isCollapsed ? 'hidden' : 'flex'} items-center gap-1.5 text-lg`}>
          <Image src="/assets/images/logo.png" width={26} height={26} alt="" aria-hidden />
          <span className="itim">AiScReam</span>
        </Link>

        {/* (only-PC) 토글 */}
        <button type="button" aria-expanded={!isCollapsed} aria-controls="sidebar" aria-label="사이드바 토글" onClick={toggleCollapsed} className="cursor-pointer p-2">
          <Image src={!isCollapsed ? '/assets/images/ico-chevron-left.svg' : '/assets/images/ico-chevron-right.svg'} width={6} height={12} alt="" className="dark:invert" />
        </button>
      </header>

      {/* (only-PC) 새 블로그 작성 버튼 */}
      <Link href="/post" className={`mx-3 mt-5 hidden items-center justify-center gap-3 rounded-sm bg-black text-base text-white hover:bg-hover pc:flex ${isCollapsed ? 'h-9.5' : 'h-10'}`}>
        <PlusIcon className="h-3.5 w-3.5 text-white" />
        <span className={isCollapsed ? 'hidden' : ''}>새 블로그 작성</span>
      </Link>

      {/* 블로그 목록 — 모바일/데스크탑 둘 다에서 보이므로 두 상태 모두 반영 */}
      <nav aria-label="블로그 목록" className={`flex-1 space-y-1 overflow-auto px-2.5 pt-5 pc:mx-3 pc:mt-8 pc:px-0 pc:pt-0 ${isCollapsed ? 'pc:hidden' : ''} ${isSidebarOpen ? '' : 'max-pc:hidden'}`}>
        {initialPosts.length === 0 ? (
          <div className="flex h-full justify-center text-primary">아직 작성한 블로그가 없습니다.</div>
        ) : (
          <ul>
            {initialPosts.map(post => {
              const isActive = pathname === `/post/${post.id}`;
              return (
                <li key={post.id}>
                  <Link href={`/post/${post.id}`} onClick={() => selectPostId(post.id)} className={`flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-2 hover:bg-base-stroke pc:p-2 ${isActive ? 'bg-base-stroke' : ''}`} aria-current={isActive ? 'page' : undefined}>
                    {isActive && isChanged && (
                      <div className="h-1 w-1 shrink-0 rounded-full bg-red-500">
                        <span className="sr-only">수정 중</span>
                      </div>
                    )}
                    <p className="truncate">{post.topic}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>

      {/* 사이드바 푸터 — 마찬가지로 두 상태 모두 반영 */}
      <footer className={`mt-auto flex border-t border-base-stroke px-4 py-4.5 ${isCollapsed ? 'justify-center' : 'justify-between'} ${isSidebarOpen ? '' : 'max-pc:hidden'}`}>
        <span className={isCollapsed ? 'hidden' : ''}>{userEmail}</span>
        <ThemeModeToggle />
        <button
          type="button"
          aria-label="로그아웃"
          className="cursor-pointer"
          onClick={() =>
            openModal({
              title: '로그아웃',
              message: '정말 로그아웃 하시겠습니까?',
              variant: 'confirm',
              cancelText: '취소',
              confirmText: '로그아웃',
              onConfirm: () => logout('/login'),
              contentLabel: '로그아웃 확인/취소 모달',
            })
          }
        >
          <Image src="/assets/images/ico-logout.svg" width={12} height={12} alt="" className="dark:invert" />
        </button>
      </footer>
    </aside>
  );
}
