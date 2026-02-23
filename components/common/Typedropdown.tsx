'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Option {
  label: string;
  value: string;
}

interface TypeDropdownProps {
  selectedType: string;
  onSelect: (value: string) => void;
  options: Option[];
  disabled?: boolean;
}

export default function TypeDropdown({ selectedType, onSelect, options, disabled = false }: TypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (type: string) => {
    if (disabled) return;
    onSelect(type);
    setIsOpen(false);
  };

  /* 타입 선택창 + 드롭다운 */
  const displayText = options.find(o => o.value === selectedType)?.label ?? selectedType;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 타입 선택창 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setIsOpen(prev => !prev);
        }}
        className="flex w-30 items-center justify-between gap-4 rounded-sm border border-input-stroke px-4 py-2 whitespace-nowrap pc:w-35"
      >
        <span className="text-center text-sm leading-3.5 font-normal text-primary pc:text-base pc:leading-4">{displayText}</span>
        <Image src="/assets/images/down.svg" width={10} height={5} alt="타입선택 버튼" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 드롭다운 옵션 */}
      {isOpen && (
        <ul className="absolute bottom-full left-0 z-10 mb-1 w-30 rounded-sm border border-input-stroke bg-white whitespace-nowrap shadow-sm pc:w-35">
          {options.map(option => (
            <li key={option.value}>
              <button type="button" onClick={() => handleSelect(option.value)} className="w-full px-4 py-2 text-left text-sm text-primary hover:bg-gray-100 pc:text-base">
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
