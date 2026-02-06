'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface UtilButtonType extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  iconSrc: string;
}

export default function UtilButton({ children, iconSrc, ...buttonProps }: UtilButtonType) {
  return (
    <button type="button" className="group flex cursor-pointer flex-col items-center gap-1 rounded-xs border border-input-stroke bg-white p-1.5 text-[10px] leading-2.5 text-primary transition duration-300 hover:bg-primary hover:text-white disabled:pointer-events-none disabled:cursor-default disabled:text-disabled pc:flex-row pc:gap-2 pc:p-0 pc:px-2 pc:py-1.5 pc:text-base pc:leading-4" {...buttonProps}>
      {/* 아이콘 */}
      <span
        aria-hidden
        style={{
          WebkitMaskImage: `url(${iconSrc})`,
          maskImage: `url(${iconSrc})`,
        }}
        className="inline-block h-2 w-2 bg-hover mask-contain mask-center mask-no-repeat transition duration-300 group-hover:bg-white group-disabled:bg-disabled pc:mx-0 pc:mb-0 pc:h-3 pc:w-3"
      />
      {children}
    </button>
  );
}
