'use client';

import { useState } from 'react';

export default function UserPrompt() {
  return (
    <div className="px-4 py-7">
      <BlogPrompt />
    </div>
  );
}

export function BlogPrompt() {
  const [value, setValue] = useState('');

  return (
    <div className="w-full">
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black pc:text-lg pc:leading-4.5">블로그 내용</p>

      <textarea className="min-h-[60px] w-full resize-none rounded-sm border border-input-stroke px-[10px] py-[10px] text-sm leading-3.5 font-normal text-primary focus:ring-0 focus:outline-none" placeholder={`어떤 내용의 블로그 글을 작성하고 싶으신가요?\n예: 초보자를 위한 Next.js 시작하기 가이드`} value={value} onChange={e => setValue(e.target.value)} />
    </div>
  );
}
