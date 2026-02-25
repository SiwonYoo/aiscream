'use client';

import Modal from 'react-modal';
import { ReactNode } from 'react';

interface BasicModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  contentLabel: string;
}

export default function BasicModal({ isOpen, onClose, contentLabel, children }: BasicModalProps) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel={contentLabel} shouldCloseOnOverlayClick shouldCloseOnEsc preventScroll={true} className="flex w-75 flex-col items-center gap-6 rounded-2xl bg-bg-base p-5 text-center shadow-[0_0_12px_rgba(0,0,0,0.2)] pc:w-90 pc:gap-9" overlayClassName="fixed inset-0 bg-black/20 flex items-center justify-center">
      {children}
    </Modal>
  );
}
