'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const MOCK_BLOG_TITLE = ['초보자를 위한 Next.js 시작하기 가이드', '프론트엔드 개발자 관점으로 바라보는 관심사의 분리와 좋은 폴더 구조 (feat. FSD)', 'Redux 어떻게 써야 잘 썼다고 소문이 날까?', 'Clean Architecture on Frontend'];

export default function Sidebar() {
  // TODO 전역 상태로 관리
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={`flex w-70 flex-col self-stretch border-r border-base-stroke bg-muted text-sm transition-all duration-200 ${isOpen ? 'max-pc:absolute max-pc:inset-0 pc:w-75' : 'max-pc:hidden pc:w-15.5'}`}>
      {/* (only-PC) 사이드바 헤더 */}
      <header className={`hidden h-15.5 border-b border-base-stroke px-4 py-4.5 pc:flex ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {/* (only-PC) 로고 */}
        <h1 className={`items-center gap-1.5 text-lg ${isOpen ? 'flex' : 'hidden'}`}>
          <Image src="/assets/images/logo.png" width={26} height={26} alt="" aria-hidden />
          <span>AiScReam</span>
        </h1>

        {/* (only-PC) 토글 */}
        <button type="button" aria-label="사이드바 토글" onClick={() => setIsOpen(prev => !prev)} className="cursor-pointer p-2">
          <Image src={isOpen ? '/assets/images/ico-chevron-left.svg' : '/assets/images/ico-chevron-right.svg'} width={6} height={12} alt="" />
        </button>
      </header>

      {/* (only-PC) 새 블로그 작성 버튼 */}
      <Link href="#" className={`mx-3 mt-5 hidden items-center justify-center gap-3 rounded-sm bg-black text-base text-white pc:flex ${isOpen ? 'h-10' : 'h-9.5'}`}>
        <Image src="/assets/images/ico-plus.svg" width={14} height={14} alt="" />
        <span className={isOpen ? '' : 'hidden'}>새 블로그 작성</span>
      </Link>

      {/* 블로그 목록 */}
      <nav aria-label="블로그 목록" className={`mt-5 flex-1 space-y-1 px-4 pc:mx-3 pc:mt-8 pc:px-0`} aria-hidden={!isOpen}>
        {/* <p className="text-center">아직 작성한 블로그가 없습니다.</p> */}
        <ul className={isOpen ? '' : 'hidden'}>
          {MOCK_BLOG_TITLE.map((item, idx) => (
            <li key={item}>
              <Link href="#" className="flex items-center gap-1.5 rounded-lg py-2 hover:bg-base-stroke pc:p-2">
                {idx === 0 && (
                  <div className="h-1 w-1 shrink-0 rounded-full bg-red-500">
                    <span className="sr-only">수정됨</span>
                  </div>
                )}
                <p className="truncate">{item}</p>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* 사이드바 푸터 */}
      <footer className={`flex px-4 py-4.5 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {/* 계정 정보 */}
        <span className={isOpen ? '' : 'hidden'}>email@gmail.com</span>
        {/* 로그아웃 버튼 */}
        <button type="button" aria-label="로그아웃" className="cursor-pointer">
          <Image src="/assets/images/ico-logout.svg" width={12} height={12} alt="" />
        </button>
      </footer>
    </aside>
  );
}
