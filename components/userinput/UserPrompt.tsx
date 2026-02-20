'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PlusIcon from '../common/PlusIcon';
import TypeDropdown from '../common/Typedropdown';
import { BlogLength, BlogType, UserPromptType } from '@/types/blog-type';

interface UserPromptProps {
  createBlog: ({ blogTitle, blogKeyword, blogType, blogLength }: UserPromptType) => Promise<void>;
  loading: boolean;
}

export default function UserPrompt({ createBlog, loading }: UserPromptProps) {
  const [blogContent, setBlogContent] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<BlogType | '타입선택'>('타입선택');
  const [selectedContent, setSelectedContent] = useState<BlogLength | '길이선택'>('길이선택');
  const [isDrop, setIsDrop] = useState(true);
  const isFormComplete = blogContent.trim() !== '' && keywords.length > 0 && selectedType !== '타입선택' && selectedContent !== '길이선택';

  const handleSubmit = async () => {
    if (!isFormComplete) return;

    await createBlog({ blogType: selectedType, blogKeyword: keywords, blogLength: selectedContent, blogTitle: blogContent });
  };

  return (
    <div className="relative">
      {/* 드롭다운 버튼 */}
      <button type="button" onClick={() => setIsDrop(prev => !prev)} className={`absolute right-7 z-30 transition-all pc:right-6 ${isDrop ? '-top-0.5' : '-top-6'}`}>
        <Image src="/assets/images/drop.svg" width={48} height={16.8} alt="드롭다운 버튼" className={`aspect-20/7 h-7 w-20 drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-transform ${isDrop ? '' : 'rotate-180'}`} />
      </button>
      <div className="border-t border-base-stroke">
        <div className={`flex flex-col gap-5 px-4 transition-all duration-300 pc:px-5 ${isDrop ? 'py-7 opacity-100 pc:py-8' : 'invisible h-10 overflow-hidden opacity-0'}`}>
          <BlogPrompt value={blogContent} setValue={setBlogContent} />
          <KeywordPrompt keywords={keywords} setKeywords={setKeywords} />
          <TypeSelect selectedType={selectedType} handleSubmit={handleSubmit} setSelectedType={setSelectedType} selectedContent={selectedContent} setSelectedContent={setSelectedContent} isFormComplete={isFormComplete} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export function BlogPrompt({ value, setValue }: { value: string; setValue: (value: string) => void }) {
  return (
    <div className="w-full">
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black pc:mb-3 pc:text-lg pc:leading-4.5">블로그 내용</p>
      <textarea className="min-h-15 w-full resize-none rounded-sm border border-input-stroke px-2.5 py-2.5 text-sm leading-3.5 font-normal text-primary focus:ring-0 focus:outline-none pc:min-h-20 pc:px-3.5 pc:py-3 pc:text-base pc:leading-4" placeholder={`어떤 내용의 블로그 글을 작성하고 싶으신가요?\n예: 초보자를 위한 Next.js 시작하기 가이드`} value={value} onChange={e => setValue(e.target.value)} />
    </div>
  );
}

export function KeywordPrompt({ keywords, setKeywords }: { keywords: string[]; setKeywords: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [inputValue, setInputValue] = useState('');

  // 키워드 추가
  const addKeyword = () => {
    const value = inputValue.trim();
    if (!value) return;

    // 20글자 초과 방지
    if (value.length > 20) {
      alert('키워드는 20글자 이하로 입력해주세요.');
      return;
    }
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

  // 20글자 제한 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setInputValue(value);
    }
  };

  // 키워드 삭제 이벤트
  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* 키워드(제목) */}
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black pc:mb-3 pc:text-lg">키워드</p>
      {/* 키워드 프롬포트 */}
      <div className="mb-1 flex items-center justify-between gap-3 pc:mb-3">
        <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} maxLength={20} className="h-8.5 flex-1 rounded-sm border border-input-stroke px-2.5 py-2.5 text-sm text-primary focus:ring-0 focus:outline-none pc:h-9 pc:text-base" placeholder="키워드를 입력하고 Enter를 누르세요." />
        <button type="button" onClick={addKeyword} className="flex h-8.5 w-8.5 items-center justify-center rounded-sm border border-input-stroke pc:h-9 pc:w-9">
          <PlusIcon color="#333" className="h-3 w-3 pc:h-3.5 pc:w-3.5" />
        </button>
      </div>
      {/* 키워드 태그 */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword, index) => (
            <div key={`${keyword}-${index}`} className="inline-flex h-4.5 items-center gap-1.5 bg-keyword p-1">
              <span className="text-xs text-primary">{keyword}</span>
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

const TYPE_OPTIONS: { label: string; value: BlogType }[] = [
  { label: '트러블 슈팅', value: 'trouble' },
  { label: 'TIL', value: 'til' },
  { label: '튜토리얼', value: 'tutorial' },
];
const CONTENT_OPTIONS: { label: string; value: BlogLength }[] = [
  { label: '간단 요약', value: 'short' },
  { label: '보통 글', value: 'normal' },
  { label: '상세 설명', value: 'long' },
];

export function TypeSelect({ handleSubmit, selectedType, setSelectedType, isFormComplete, selectedContent, setSelectedContent, loading }: { handleSubmit: () => Promise<void>; selectedType: string; setSelectedType: Dispatch<SetStateAction<BlogType | '타입선택'>>; isFormComplete: boolean; selectedContent: string; setSelectedContent: Dispatch<SetStateAction<BlogLength | '길이선택'>>; loading: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <TypeDropdown selectedType={selectedType} onSelect={v => setSelectedType(v as BlogType)} options={TYPE_OPTIONS} />

        {/* 설명 툴팁 */}
        <div className="relative" ref={tooltipRef}>
          <button type="button" onClick={() => setShowTooltip(prev => !prev)}>
            <Image src="/assets/images/explain.svg" width={16} height={16} alt="타입선택 설명" />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full left-0 z-20 mb-3 w-full min-w-70 rounded-sm bg-info p-2.5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] pc:min-w-81 pc:p-3">
              <p className="text-left text-[10px] leading-4 font-light text-primary pc:text-xs">
                튜토리얼 : 코드예시가 포함된 형식의 블로그를 생성합니다.
                <br /> TIL : Today I Learned 방식으로 블로그를 생성합니다.
                <br /> 트러블슈팅 : 발생한 에러/문제를 중심으로 블로그를 생성합니다.
              </p>
            </div>
          )}
        </div>
      </div>

      <TypeDropdown selectedType={selectedContent} onSelect={v => setSelectedContent(v as BlogLength)} options={CONTENT_OPTIONS} />

      {/* 블로그 글 생성하기 */}
      <button type="button" onClick={handleSubmit} disabled={!isFormComplete || loading} className={`flex flex-1 items-center justify-center gap-3 rounded-sm px-2.5 py-2 transition-colors ${!loading && isFormComplete ? 'cursor-pointer bg-active hover:bg-hover active:bg-active' : 'cursor-not-allowed bg-disabled'}`}>
        <Image src="/assets/images/creat.svg" width={16} height={16} alt="" />
        <span className="text-sm leading-3.5 font-normal text-white pc:text-base pc:leading-4">블로그 글 생성하기</span>
      </button>
    </div>
  );
}
