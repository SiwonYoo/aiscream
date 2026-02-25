'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // 마운트 전에 렌더링 X

  // 라이트 모드일 때 true
  const isOn = resolvedTheme !== 'dark';
  const bgClass = isOn ? 'bg-[linear-gradient(90deg,#F6B1C3_7.5%,#D8CFF0_100%)]' : 'bg-[#C7C7C7]';
  const circleClass = isOn ? 'bg-[#FCEBEF]' : 'translate-x-4 ';

  return (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => setTheme(isOn ? 'dark' : 'light')} className={`relative h-5 w-9 rounded-[10px] transition-all duration-300 ${bgClass}`}>
        <div className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full shadow-md transition-transform duration-300 ${circleClass} flex items-center justify-center`}>{!isOn && <Image src="/assets/images/moon.svg" width={14} height={16} alt="다크모드 아이콘" />}</div>
      </button>
    </div>
  );
}
