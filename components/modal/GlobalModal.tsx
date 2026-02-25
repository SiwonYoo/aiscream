'use client';

import { useModalStore } from '@/stores/modal-store';
import BasicModal from './BasicModal';
import Image from 'next/image';
import { useEffect } from 'react';

export default function GlobalModal() {
  const { modal, closeModal } = useModalStore();

  // 모달 열리면 바깥 스크롤 막는 동작
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [modal]);

  return (
    <BasicModal isOpen={!!modal} onClose={closeModal} contentLabel={modal?.contentLabel ?? 'modal'}>
      {!modal
        ? null
        : (() => {
            const { title, message, variant, confirmText = '확인', cancelText = '확인', onConfirm } = modal;

            return (
              <>
                <div className="flex flex-col items-center gap-5 pc:gap-6">
                  <div className="relative aspect-square w-10 pc:w-14">{variant === 'info' ? <Image src="/assets/images/modal-check-2x.png" alt="" aria-hidden fill sizes="40px, (min-width: 768px) 56px" /> : <Image src="/assets/images/modal-warn-2x.png" alt="" aria-hidden fill sizes="40px, (min-width: 768px) 56px" />}</div>
                  <div className="flex flex-col gap-1.5 pc:gap-2">
                    <h2 className="font-semibold text-primary pc:text-lg">{title}</h2>
                    <p className="text-sm break-keep text-secondary pc:text-base">{message}</p>
                  </div>
                </div>
                <div className="modal-btns flex justify-end gap-4">
                  {/* 기본 닫힘 버튼 */}
                  <button
                    className="cursor-pointer rounded-sm bg-black px-4 py-1.5 text-sm text-white hover:bg-hover pc:text-base"
                    onClick={() => {
                      closeModal();
                    }}
                  >
                    {cancelText}
                  </button>

                  {/* 기능 넣을 버튼(삭제...등등) */}
                  {variant === 'confirm' && (
                    <button
                      className="cursor-pointer rounded-sm bg-[#E6A1B3] px-4 py-1.5 text-sm text-white hover:bg-[#D9A0B5] pc:text-base dark:text-black"
                      onClick={() => {
                        onConfirm?.();
                        closeModal();
                      }}
                    >
                      {confirmText}
                    </button>
                  )}
                </div>
              </>
            );
          })()}
    </BasicModal>
  );
}
