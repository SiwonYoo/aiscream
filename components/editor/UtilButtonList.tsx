'use client';

import UtilButton from '@/components/editor/UtilButton';
import { useEditorContext } from '@/contexts/EditorContext';
import { useModalStore } from '@/stores/modal-store';
import { useState } from 'react';

export default function UtilButtonList() {
  const [isDownOpen, setIsDownOpen] = useState(false); // 다운받기 하위 옵션 열림/닫힘 상태

  // 에디터 관련
  const { editor, markdownSource } = useEditorContext();

  // 참고해서 사용하시면 됩니다!
  // markdown 형식: markdownSource
  // html 형식: editor.getHTML()

  // 다운받기 클릭 이벤트
  const onClickDown = () => {
    setIsDownOpen(!isDownOpen);
  };

  // 다운로드 옵션 클릭 이벤트 (임시로 alert을 띄워서 확인했습니다. 해당 부분 작업 시 변경하거나 앲애주세요!)
  const onClickDownOption = (e: React.MouseEvent<HTMLButtonElement>) => {
    const downType = e.currentTarget.dataset.downtype;
    setIsDownOpen(!isDownOpen);
    alert(`.${downType} 파일 다운로드`);
  };

  // 모달 열기
  const openModal = useModalStore(state => state.openModal);

  // 테스트 함수 (삭제 모달에 넣었습니다. 해당 부분 작업 시 없애주세요!)
  const testFunc = () => {
    alert('완료!');
  };

  return (
    <div className="util-button-list flex items-center justify-center gap-4 border-t border-base-stroke px-4 py-5 pc:gap-7.5">
      <UtilButton iconSrc="/assets/images/ico-save-black-2x.png" onClick={() => {}} disabled>
        수정완료
      </UtilButton>
      <UtilButton
        iconSrc="/assets/images/ico-copy-black-2x.png"
        onClick={() =>
          openModal({
            title: '복사 완료',
            message: '복사가 완료되었습니다.',
            variant: 'info',
            cancelText: '확인',
            contentLabel: '복사 완료 알림 모달',
          })
        }
      >
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
          <li className="border-b border-input-stroke">
            <button type="button" role="menuitem" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={onClickDownOption} data-downtype="md">
              .md
            </button>
          </li>
          <li role="menuitem">
            <button type="button" role="menuitem" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={onClickDownOption} data-downtype="html">
              .html
            </button>
          </li>
        </ul>
      </div>
      <UtilButton
        iconSrc="/assets/images/ico-publish-black-2x.png"
        onClick={() =>
          openModal({
            title: '발행 완료',
            message: '발행이 완료되었습니다.',
            variant: 'info',
            cancelText: '확인',
            contentLabel: '발행 완료 알림 모달',
          })
        }
      >
        발행하기
      </UtilButton>
      <UtilButton
        iconSrc="/assets/images/ico-delete-black-2x.png"
        onClick={() =>
          openModal({
            title: '삭제 하시겠습니까?',
            message: '작성된 블로그 글을 정말로 삭제 하시겠습니까? 데이터는 복원되지 않습니다.',
            variant: 'confirm',
            cancelText: '취소',
            confirmText: '삭제하기',
            onConfirm: testFunc,
            contentLabel: '삭제 알림 및 선택 모달',
          })
        }
      >
        삭제하기
      </UtilButton>
    </div>
  );
}
