'use client';

import { useUIStore } from '@/stores/ui-store';
import Image from 'next/image';

export default function Header() {
  const toggleSidebar = useUIStore(state => state.toggleSidebar);

  return (
    // (only-Mobile) 헤더
    <header className="flex items-center justify-between border-b border-base-stroke bg-muted p-4 pc:hidden">
      {/* 사이드바 토글 */}
      <button type="button" aria-label="사이드바 토글" onClick={toggleSidebar} className="cursor-pointer">
        <Image src="/assets/images/ico-menu.svg" width={18} height={18} alt="" />
      </button>

      {/* 로고 */}
      <h1 className="flex items-center gap-1.5 text-sm">
        <Image src="/assets/images/logo.png" width={22} height={22} alt="" aria-hidden />
        <span className="itim">AiScReam</span>
      </h1>

      {/* 새 블로그 작성 버튼 */}
      <button aria-label="글 생성하기" className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm bg-black">
        <Image src="/assets/images/ico-plus.svg" width={10} height={10} alt="" />
      </button>
    </header>
  );
}
