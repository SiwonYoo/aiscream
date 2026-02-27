'use client';

import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PlusIcon from '../common/PlusIcon';
import TypeDropdown from '../common/Typedropdown';
import DropIcon from '../common/DropIcon';
import CloseIcon from '../common/CloseIcon';
import CreatIcon from '../common/CreatIcon';
import { BlogLength, BlogType, UserPromptType } from '@/types/blog-type';

interface UserPromptProps {
  handleCreateBlog?: ({ blogTitle, blogKeyword, blogType, blogLength }: UserPromptType) => Promise<void>;
  readOnly?: boolean;
  initialValue?: Partial<UserPromptType>;
  loading?: boolean;
  defaultCollapsed?: boolean;
}
export default function UserPrompt({ handleCreateBlog, readOnly = false, initialValue, loading = false, defaultCollapsed = false }: UserPromptProps) {
  const [blogContent, setBlogContent] = useState(initialValue?.blogTitle ?? '');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<BlogType | '타입선택'>('타입선택');
  const [selectedContent, setSelectedContent] = useState<BlogLength | '길이선택'>('길이선택');
  const [isDrop, setIsDrop] = useState(!defaultCollapsed);
  const isFormComplete = blogContent.trim() !== '' && keywords.length > 0 && selectedType !== '타입선택' && selectedContent !== '길이선택';

  useEffect(() => {
    if (!initialValue) return;

    setBlogContent(initialValue.blogTitle ?? '');
    setKeywords(initialValue.blogKeyword ?? []);
    setSelectedType((initialValue.blogType as BlogType) ?? '타입선택');
    setSelectedContent((initialValue.blogLength as BlogLength) ?? '길이선택');
  }, [initialValue]);

  const handleSubmit = async () => {
    if (readOnly || !handleCreateBlog) return;
    if (!isFormComplete) return;

    await handleCreateBlog({ blogType: selectedType as BlogType, blogKeyword: keywords, blogLength: selectedContent as BlogLength, blogTitle: blogContent });
  };

  return (
    <div className="relative border-t border-base-stroke bg-muted">
      <div className="inner mx-auto pc:max-w-300">
        {/* 드롭다운 버튼 */}
        <button type="button" onClick={() => setIsDrop(prev => !prev)} className={`absolute right-7 z-1 origin-top cursor-pointer transition-all duration-0 pc:right-6 ${isDrop ? 'top-0' : '-top-px rotate-180'}`}>
          <DropIcon aria-label={isDrop ? '프롬프트 접기' : '프롬프트 펼치기'} className={`aspect-80/28 w-12 drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)] pc:w-20 dark:drop-shadow-[0_2px_6px_rgba(255,255,255,0.05)]`} />
        </button>

        <div className={`flex flex-col gap-5 px-4 py-7 transition-all duration-0 pc:py-8 ${isDrop ? 'opacity-100' : 'invisible h-10 overflow-hidden opacity-0'}`}>
          <BlogPrompt value={blogContent} setValue={setBlogContent} disabled={readOnly} />
          <KeywordPrompt keywords={keywords} setKeywords={setKeywords} disabled={readOnly} />
          <TypeSelect selectedType={selectedType} handleSubmit={handleSubmit} setSelectedType={setSelectedType} selectedContent={selectedContent} setSelectedContent={setSelectedContent} isFormComplete={isFormComplete} disabled={readOnly} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export function BlogPrompt({ value, setValue, disabled = false }: { value: string; setValue: (value: string) => void; disabled?: boolean }) {
  return (
    <div className="w-full">
      <p className="mb-1.5 text-sm leading-3.5 font-semibold text-black pc:mb-3 pc:text-lg pc:leading-4.5">블로그 내용</p>
      <textarea disabled={disabled} className="min-h-15 w-full resize-none rounded-sm border border-input-stroke bg-bg-base px-2.5 py-2.5 text-sm leading-3.5 font-normal text-primary focus:ring-0 focus:outline-none disabled:cursor-not-allowed pc:min-h-20 pc:px-3.5 pc:py-3 pc:text-base pc:leading-4" placeholder={`어떤 내용의 블로그 글을 작성하고 싶으신가요?\n예: 초보자를 위한 Next.js 시작하기 가이드`} value={value} onChange={e => setValue(e.target.value)} />
    </div>
  );
}

export function KeywordPrompt({ keywords, setKeywords, disabled = false }: { keywords: string[]; setKeywords: React.Dispatch<React.SetStateAction<string[]>>; disabled?: boolean }) {
  const [inputValue, setInputValue] = useState('');

  // 키워드 추가
  const addKeyword = () => {
    if (disabled) return;

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

    // mac 한글 입력 대응
    setTimeout(() => {
      setInputValue('');
    }, 0);
  };

  // Enter 이벤트
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중이면 Enter 무시
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();

      const value = inputValue.trim();
      if (!value) return;

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
        <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} maxLength={20} disabled={disabled} className="h-8.5 flex-1 rounded-sm border border-input-stroke bg-bg-base px-2.5 py-2.5 text-sm text-primary focus:ring-0 focus:outline-none disabled:cursor-not-allowed pc:h-9 pc:text-base" placeholder="키워드를 입력하고 Enter를 누르세요." />
        <button type="button" onClick={addKeyword} disabled={disabled} className="flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-sm border border-input-stroke pc:h-9 pc:w-9">
          <PlusIcon className="h-3 w-3 text-primary pc:h-3.5 pc:w-3.5" />
        </button>
      </div>
      {/* 키워드 태그 */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((keyword, index) => (
            <div key={`${keyword}-${index}`} className="inline-flex h-4.5 items-center gap-1.5 bg-keyword p-1">
              <span className="text-xs text-primary">{keyword}</span>
              {/* 삭제버튼 */}
              <button type="button" aria-label={`키워드 "${keyword}" 삭제`} onClick={() => removeKeyword(index)} disabled={disabled} className="flex items-center justify-center">
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const TYPE_OPTIONS: { label: string; value: BlogType }[] = [
  { label: '트러블 슈팅', value: 'troubleshooting' },
  { label: 'TIL', value: 'til' },
  { label: '튜토리얼', value: 'tutorial' },
];
const CONTENT_OPTIONS: { label: string; value: BlogLength }[] = [
  { label: '간단 요약', value: 'short' },
  { label: '보통 글', value: 'normal' },
  { label: '상세 설명', value: 'long' },
];

export function TypeSelect({ handleSubmit, selectedType, setSelectedType, isFormComplete, selectedContent, setSelectedContent, disabled = false, loading = false }: { handleSubmit: () => Promise<void>; selectedType: string; setSelectedType: Dispatch<SetStateAction<BlogType | '타입선택'>>; isFormComplete: boolean; selectedContent: string; setSelectedContent: Dispatch<SetStateAction<BlogLength | '길이선택'>>; disabled?: boolean; loading?: boolean }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const isDisabled = disabled || !isFormComplete;

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
    <div className="flex flex-wrap items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-2 pc:contents">
          <div className="flex items-center gap-2">
            <TypeDropdown selectedType={selectedType} onSelect={v => !disabled && setSelectedType(v as BlogType)} options={TYPE_OPTIONS} disabled={disabled} />
            {/* 설명 툴팁 */}
            <div className="relative" ref={tooltipRef}>
              <button type="button" className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-placeholder text-xs text-placeholder" aria-label="블로그 타입 설명 보기" aria-expanded={showTooltip} onClick={() => setShowTooltip(prev => !prev)}>
                i
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
          <TypeDropdown selectedType={selectedContent} onSelect={v => !disabled && setSelectedContent(v as BlogLength)} options={CONTENT_OPTIONS} disabled={disabled} />
        </div>
      </div>

      {/* 블로그 글 생성하기 */}
      <button type="button" onClick={handleSubmit} disabled={isDisabled || loading} className={`flex flex-1 items-center justify-center gap-2 rounded-sm px-2 py-6 transition-colors pc:min-w-55 pc:gap-3 pc:py-2 ${!loading && !isDisabled ? 'cursor-pointer bg-active hover:bg-hover active:bg-active' : 'cursor-not-allowed bg-disabled'}`}>
        <CreatIcon className="text-white" />
        <span className="text-sm leading-3.5 font-normal text-white pc:text-base pc:leading-4">블로그 글 생성하기</span>
      </button>
    </div>
  );
}
