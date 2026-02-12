'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/ui-store';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { getMyPosts } from '@/data/functions/post';
import type { Post } from '@/types/post';

// const MOCK_BLOG_TITLE = ['초보자를 위한 Next.js 시작하기 가이드', '프론트엔드 개발자 관점으로 바라보는 관심사의 분리와 좋은 폴더 구조 (feat. FSD)', 'Redux 어떻게 써야 잘 썼다고 소문이 날까?', 'Clean Architecture on Frontend'];
export default function Sidebar() {
  const { logout } = useAuth();
  const { toggleSidebar, isSidebarOpen } = useUIStore();
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (e) {
        console.error(e);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);

  return (
    <aside id="sidebar" className={`z-10 flex h-dvh w-70 flex-col self-stretch border-r border-base-stroke bg-muted text-sm transition-all duration-200 max-pc:absolute max-pc:inset-0 ${isSidebarOpen ? 'pc:w-75' : 'max-pc:w-0 pc:w-15.5'}`}>
      {/* (only-PC) 사이드바 헤더 */}
      <header className={`hidden h-15.5 border-b border-base-stroke px-4 py-4.5 pc:flex ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {/* (only-PC) 로고 */}
        <h1 className={`items-center gap-1.5 text-lg ${isSidebarOpen ? 'flex' : 'hidden'}`}>
          <Image src="/assets/images/logo.png" width={26} height={26} alt="" aria-hidden />
          <span className="itim">AiScReam</span>
        </h1>

        {/* (only-PC) 토글 */}
        <button type="button" aria-expanded={isSidebarOpen} aria-controls="sidebar" aria-label="사이드바 토글" onClick={toggleSidebar} className="cursor-pointer p-2">
          <Image src={isSidebarOpen ? '/assets/images/ico-chevron-left.svg' : '/assets/images/ico-chevron-right.svg'} width={6} height={12} alt="" />
        </button>
      </header>

      {/* (only-PC) 새 블로그 작성 버튼 */}
      <Link href="#" className={`mx-3 mt-5 hidden items-center justify-center gap-3 rounded-sm bg-black text-base text-white pc:flex ${isSidebarOpen ? 'h-10' : 'h-9.5'}`}>
        <Image src="/assets/images/ico-plus.svg" width={14} height={14} alt="" />
        <span className={isSidebarOpen ? '' : 'hidden'}>새 블로그 작성</span>
      </Link>

      {/* 블로그 목록 */}
      <nav aria-label="블로그 목록" className={`mt-5 flex-1 space-y-1 overflow-auto px-4 pc:mx-3 pc:mt-8 pc:px-0`} aria-hidden={!isSidebarOpen}>
        {!isSidebarOpen ? null : posts === null ? null : posts.length === 0 ? (
          <div className="flex h-full justify-center text-primary">아직 작성한 블로그가 없습니다.</div>
        ) : (
          <ul>
            {posts.map((post, idx) => (
              <li key={post.id}>
                <Link href="#" className="flex items-center gap-1.5 rounded-lg py-2 hover:bg-base-stroke pc:p-2">
                  {idx === 0 && (
                    <div className="h-1 w-1 shrink-0 rounded-full bg-red-500">
                      <span className="sr-only">최신 글</span>
                    </div>
                  )}
                  <p className="truncate">{post.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* 사이드바 푸터 */}
      <footer className={`mt-auto flex px-4 py-4.5 ${isSidebarOpen ? 'justify-between' : 'justify-center max-pc:hidden'}`}>
        {/* 계정 정보 */}
        <span className={isSidebarOpen ? '' : 'hidden'}>email@gmail.com</span>
        {/* 로그아웃 버튼 */}
        <button type="button" aria-label="로그아웃" className="cursor-pointer" onClick={() => logout('/login')}>
          <Image src="/assets/images/ico-logout.svg" width={12} height={12} alt="" />
        </button>
      </footer>
    </aside>
  );
}
