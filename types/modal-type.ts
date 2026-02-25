import type { ReactNode } from 'react';
export type ModalVariant = 'info' | 'confirm' | 'custom';

export interface ModalType {
  title: string; // modal 타이틀
  message: string; // modal 메세지
  variant: ModalVariant; // modal 형식 (info: 닫기 버튼만 있는 형식, confirm은 동작 버튼 + 닫기 버튼 있는 형식)

  cancelText?: string; // 기본 닫기 버튼에 들어갈 텍스트
  confirmText?: string; // 동작 버튼에 들어갈 텍스트

  onConfirm?: () => void; // 동작 버튼으로 동작할 함수
  contentLabel: string; // 어떤 모달인지 명시 (접근성 - 스크린리더용)

  children?: ReactNode;
}
