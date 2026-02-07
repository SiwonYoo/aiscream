'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function UserPrompt() {
  return (
    <div className="px-4 py-7">
      <BlogPrompt />
      <KeywordPrompt />
    </div>
  );
}

export function BlogPrompt() {
  const [value, setValue] = useState('');

  return (
    <div className="w-full">
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black pc:mb-3 pc:text-lg pc:leading-4.5">블로그 내용</p>
      <textarea
        className="min-h-15 w-full resize-none rounded-sm border border-input-stroke px-2.5 py-2.5 text-sm leading-3.5 font-normal text-primary focus:ring-0 focus:outline-none pc:min-h-20 pc:px-3.5 pc:py-3 pc:text-base pc:leading-4"
        placeholder={`어떤 내용의 블로그 글을 작성하고 싶으신가요?\n예: 초보자를 위한 Next.js 시작하기 가이드`}
        value={value}
        onChange={e => setValue(e.target.value)}
        onInput={e => {
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        }}
      />
    </div>
  );
}

export function KeywordPrompt() {
  return (
    <div>
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black">키워드</p>
      <div className="flex items-center justify-between gap-3">
        <textarea className="h-8.5 flex-1 border" placeholder="키워드를 입력하고 Enter를 누르세요." />
        <button className="flex items-center justify-center rounded-sm border border-input-stroke p-2.5">
          <Image src="/assets/images/ico-plus.svg" width={14} height={14} alt="생성하기 버튼 +" />
        </button>
      </div>
      <span>Next.js</span>
    </div>
  );
}
