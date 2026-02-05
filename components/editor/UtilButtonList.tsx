'use client';

import UtilButton from '@/components/editor/UtilButton';
import Image from 'next/image';
import { ReactNode, useState } from 'react';

export default function UtilButtonList() {
  const [isDownOpen, setIsDownOpen] = useState(false); // 다운받기 하위 옵션 열림/닫힘 상태

  // 다운받기 클릭 이벤트
  const onClickDown = () => {
    setIsDownOpen(!isDownOpen);
  };

  // 다운로드 옵션 클릭 이벤트
  const onClickDownOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    const downType = e.currentTarget.dataset.downtype;
    alert(`.${downType} 파일 다운로드`);
  };

  return (
    <div className="util-button-list borter-t flex items-center justify-center gap-4 border-t border-base-stroke px-4 py-5 pc:gap-7.5">
      <UtilButton iconSrc="/assets/images/ico-save-black-2x.png" onClick={() => {}} disabled>
        수정완료
      </UtilButton>
      <UtilButton iconSrc="/assets/images/ico-copy-black-2x.png" onClick={() => {}}>
        복사하기
      </UtilButton>
      <div className="relative">
        <UtilButton iconSrc="/assets/images/ico-download-black-2x.png" onClick={onClickDown} aria-haspopup="menu">
          <div className="flex items-center gap-1 pc:gap-2">
            다운받기
            <span
              aria-hidden
              style={{
                WebkitMaskImage: `url('/assets/images/ico-chevron-down-black-2x.png')`,
                maskImage: `url('/assets/images/ico-chevron-down-black-2x.png')`,
              }}
              className="relative h-0.75 w-1.5 bg-hover mask-contain mask-center mask-no-repeat transition duration-300 group-hover:bg-white pc:h-[5.5px] pc:w-2.5"
            />
          </div>
        </UtilButton>
        <ul className={`absolute -bottom-[130%] left-0 w-full overflow-hidden rounded-xs border border-input-stroke bg-white text-[10px] transition duration-300 pc:-bottom-[250%] pc:text-base ${isDownOpen ? 'visible translate-y-1 opacity-100' : 'invisible translate-y-0 opacity-0'}`} role="menu">
          <li className="border-b border-input-stroke" role="menuitem">
            <button type="button" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={onClickDownOption} data-downtype="md">
              .md
            </button>
          </li>
          <li role="menuitem">
            <button type="button" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={onClickDownOption} data-downtype="html">
              .html
            </button>
          </li>
        </ul>
      </div>
      <UtilButton iconSrc="/assets/images/ico-publish-black-2x.png" onClick={() => {}}>
        발행하기
      </UtilButton>
      <UtilButton iconSrc="/assets/images/ico-delete-black-2x.png" onClick={() => {}}>
        삭제하기
      </UtilButton>
    </div>
  );
}
