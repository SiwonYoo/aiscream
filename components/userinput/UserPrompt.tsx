'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PlusIcon from '../common/PlusIcon';

export default function UserPrompt() {
  const [blogContent, setBlogContent] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('타입선택');
  const [isDrop, setIsDrop] = useState(true);

  // 모든 필드가 채워졌는지 확인
  const isFormComplete = blogContent.trim() !== '' && keywords.length > 0 && selectedType !== '타입선택';

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
          <TypeSelect selectedType={selectedType} setSelectedType={setSelectedType} isFormComplete={isFormComplete} />
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

const TYPE_OPTIONS = ['트러블 슈팅', 'TIL', '튜토리얼'];

export function TypeSelect({ selectedType, setSelectedType, isFormComplete }: { selectedType: string; setSelectedType: (type: string) => void; isFormComplete: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  //  드롭다운이 열려있는 상태에서 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: string) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      {/* 타입 선택창 + 설명 */}
      <div className="relative flex items-center gap-2" ref={wrapperRef}>
        {/* 타입  선택창  */}
        <button type="button" onClick={() => setIsOpen(prev => !prev)} className="flex w-30 items-center justify-between gap-4 rounded-sm border border-input-stroke px-4 py-2 whitespace-nowrap pc:w-35">
          <span className="text-center text-sm leading-3.5 font-normal text-primary pc:text-base pc:leading-4">{selectedType}</span>
          <Image src="/assets/images/down.svg" width={10} height={5} alt="타입선택 버튼" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {/* 설명 */}
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

        {/* 드롭다운 */}
        {isOpen && (
          <ul className="absolute top-full left-0 z-10 mt-1 rounded-sm border border-input-stroke bg-white whitespace-nowrap shadow-sm">
            {TYPE_OPTIONS.map(option => (
              <li key={option}>
                <button type="button" onClick={() => handleSelect(option)} className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-gray-100">
                  {option}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 블로그 글 생성하기 */}
      <button type="button" disabled={!isFormComplete} className={`flex flex-1 items-center justify-center gap-3 rounded-sm px-2.5 py-2 transition-colors ${isFormComplete ? 'cursor-pointer bg-active hover:bg-hover active:bg-active' : 'cursor-not-allowed bg-disabled'}`}>
        <Image src="/assets/images/creat.svg" width={16} height={16} alt="" />
        <span className="text-sm leading-3.5 font-normal text-white pc:text-base pc:leading-4">블로그 글 생성하기</span>
      </button>
    </div>
  );
}
