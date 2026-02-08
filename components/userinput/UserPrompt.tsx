'use client';

import { useState } from 'react';
import Image from 'next/image';
import { text } from 'stream/consumers';

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
  const [inputValue, setInputValue] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  // 키워드 추가
  const addKeyword = () => {
    const value = inputValue.trim();
    if (!value) return;

    // 중복 키워드 방지
    if (keywords.includes(value)) {
      setInputValue('');
      return;
    }

    setKeywords(prev => [...prev, value]);
    setInputValue('');
  };

  // Enter 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // 키워드 삭제 이벤트
  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* 키워드(제목) */}
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black">키워드</p>
      {/* 키워드 프롬포트 */}
      <div className="mb-1 flex items-center justify-between gap-3">
        <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={handleKeyDown} className="h-8.5 flex-1 rounded-sm border border-input-stroke px-2.5 py-2.5 text-primary focus:ring-0 focus:outline-none" placeholder="키워드를 입력하고 Enter를 누르세요." />
        <button type="button" onClick={addKeyword} className="flex items-center justify-center rounded-sm border border-input-stroke p-2.5">
          <Image src="/assets/images/ico-plus.svg" width={14} height={14} alt="생성하기 버튼 +" />
        </button>
      </div>
      {/* 키워드 태그 */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword, index) => (
            <div key={`${keyword}-${index}`} className="inline-flex h-4.5 items-center gap-1.5 bg-keyword p-1">
              <span className="text-[10px] text-primary">{keyword}</span>
              {/* 삭제버튼 */}
              <button type="button" onClick={() => removeKeyword(index)} className="flex items-center justify-center">
                <Image src="/assets/images/vector.svg" width={5} height={5} alt="삭제하기 버튼" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
