'use client';

import Modal from 'react-modal';
import { useEffect } from 'react';

// 접근성
export default function ModalInitializer() {
  useEffect(() => {
    Modal.setAppElement('#app-root');
  }, []);

  return null;
}
