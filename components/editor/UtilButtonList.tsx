'use client';

import UtilButton from '@/components/editor/UtilButton';
import { useEditorContext } from '@/contexts/EditorContext';
import { deletePost, updatePost } from '@/data/actions/post';
import { getPostTopicById } from '@/data/functions/post';
import { useModalStore } from '@/stores/modal-store';
import { useState, useCallback } from 'react';
import NotionPublishModal from '../modal/NotionPublishModal';
import NotionAutoResume from '../notion/NotionAutoResume';
import { useParams, useRouter } from 'next/navigation';

export default function UtilButtonList() {
  const [isDownOpen, setIsDownOpen] = useState(false); // 다운받기 하위 옵션 열림/닫힘 상태

  const params = useParams();
  const postId = params.id as string;

  const router = useRouter();

  // 에디터 관련
  const { topic, editor, markdownSource, isChanged, syncInitialContent, validate } = useEditorContext();

  // 모달 열기
  const openModal = useModalStore(state => state.openModal);

  // Notion 발행 모달 열기
  const openNotionModal = useCallback(async () => {
    if (!postId) return;

    let title = 'Untitled';

    try {
      const t = await getPostTopicById(postId);
      if (t) title = t;
    } catch (e) {
      console.error('title fetch fail', e);
    }

    openModal({
      title: 'Notion 발행',
      message: '',
      variant: 'custom',
      cancelText: '닫기',
      contentLabel: 'Notion 발행 모달',
      children: <NotionPublishModal postId={postId} postTitle={title} markdown={markdownSource} autoPick />,
    });
  }, [openModal, markdownSource, postId]);

  // 수정완료
  const handleUpdate = async () => {
    if (!postId) return;
    if (!validate()) return;

    try {
      await updatePost(postId, {
        topic,
        content: markdownSource,
      });
      syncInitialContent();
    } catch (error) {
      console.error('저장 중 오류가 발생했습니다.', error);
      openModal({ title: '오류', message: '저장 중 문제가 발생했습니다.', variant: 'info', contentLabel: '수정 에러 알림 모달' });
    }
  };

  // 복사하기
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownSource);
      openModal({
        title: '복사 완료',
        message: '복사가 완료되었습니다.',
        variant: 'info',
        cancelText: '확인',
        contentLabel: '복사 완료 알림 모달',
      });
    } catch (error) {
      console.error('복사 중 오류가 발생했습니다.', error);
      openModal({ title: '오류', message: '복사 중 문제가 발생했습니다.', variant: 'info', contentLabel: '복사 에러 알림 모달' });
    }
  };

  // 다운로드
  const handleDownload = async (type: 'md' | 'html') => {
    if (!editor) return;
    const isMdType = type === 'md';

    // HTML 다운 시 에디터를 최신 마크다운으로 동기화
    if (!isMdType) {
      editor.commands.setContent(markdownSource);
    }

    // 파일 이름 설정 (제목 조회 실패 시 날짜로 폴백)
    const now = new Date();
    const formatted = now.toISOString().slice(0, 10);
    let title: string | null = null;
    try {
      title = await getPostTopicById(postId);
    } catch (error) {
      console.error('제목 조회 중 오류가 발생했습니다. 날짜로 폴백합니다.', error);
    }
    const fileName = `${title ?? `doc-${formatted}`}.${type}`;

    // 데이터 설정
    const data = isMdType ? markdownSource : editor.getHTML();
    const mime = isMdType ? 'text/markdown;charset=utf-8;' : 'text/html;charset=utf-8;';

    // 문자열을 파일 객체로 변환
    const blob = new Blob([data], { type: mime });

    // 임시 URL 생성
    const url = URL.createObjectURL(blob);

    // a 태그 강제 클릭
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 메모리 정리
    URL.revokeObjectURL(url);
  };

  // 삭제하기
  const handleDelete = async () => {
    if (!postId) return;

    try {
      await deletePost(postId);
      router.replace('/post');
    } catch (error) {
      console.error('삭제 중 오류가 발생했습니다.', error);
      openModal({ title: '오류', message: '삭제 중 문제가 발생했습니다.', variant: 'info', contentLabel: '삭제 에러 알림 모달' });
    }
  };

  return (
    <div className="util-button-list flex flex-wrap items-center justify-center gap-4 border-t border-base-stroke px-4 py-4 pc:gap-x-5 pc:gap-y-2">
      <NotionAutoResume onResume={() => openNotionModal()} />
      <UtilButton iconSrc="/assets/images/ico-save-black-2x.png" onClick={handleUpdate} disabled={!isChanged}>
        {isChanged ? '수정하기' : '수정완료'}
      </UtilButton>
      <UtilButton iconSrc="/assets/images/ico-copy-black-2x.png" onClick={handleCopy}>
        복사하기
      </UtilButton>
      <div className="relative">
        <UtilButton iconSrc="/assets/images/ico-download-black-2x.png" onClick={() => setIsDownOpen(!isDownOpen)} aria-haspopup="menu">
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
        <ul className={`absolute -bottom-[130%] left-0 z-1 w-full overflow-hidden rounded-xs border border-input-stroke bg-white text-[10px] transition duration-300 pc:-bottom-[250%] pc:text-base ${isDownOpen ? 'visible translate-y-1 opacity-100' : 'invisible translate-y-0 opacity-0'}`} role="menu">
          <li className="border-b border-input-stroke">
            <button type="button" role="menuitem" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={() => handleDownload('md')}>
              .md
            </button>
          </li>
          <li>
            <button type="button" role="menuitem" className="h-full w-full px-2 py-1 text-left transition duration-300 hover:bg-keyword pc:px-4 pc:py-1.5" onClick={() => handleDownload('html')}>
              .html
            </button>
          </li>
        </ul>
      </div>
      <UtilButton iconSrc="/assets/images/ico-publish-black-2x.png" onClick={() => openNotionModal()}>
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
            onConfirm: handleDelete,
            contentLabel: '삭제 알림 및 선택 모달',
          })
        }
      >
        삭제하기
      </UtilButton>
    </div>
  );
}
