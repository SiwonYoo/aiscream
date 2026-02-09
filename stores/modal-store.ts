import { create } from 'zustand';
import { ModalType } from '@/types/modal-type';

interface ModalStore {
  modal: ModalType | null;

  openModal: (modal: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>(set => ({
  modal: null,

  openModal: modal => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
