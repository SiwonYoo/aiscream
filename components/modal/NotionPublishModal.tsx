'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/modal-store';

type Step = 'HOME' | 'PICK' | 'PUBLISHING';

type NotionPageItem = {
  id: string;
  title: string;
  url: string;
  lastEditedTime?: string;
};

type PagesResponse = { pages: NotionPageItem[] } | { error: 'NOT_CONNECTED' | 'UNAUTHORIZED' | 'DB_ERROR' | 'NOTION_API_ERROR'; detail?: string };

type PublishResponse = { ok: true; page: { id: string; url: string } } | { ok: false; message: string };

function formatKST(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function NotionPublishModal({ postId, postTitle, markdown }: { postId: string; postTitle: string; markdown: string }) {
  const router = useRouter();
  const closeModal = useModalStore(s => s.closeModal);

  const [step, setStep] = useState<Step>('HOME');
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');

  const [pages, setPages] = useState<NotionPageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const [isPersonalOpen, setIsPersonalOpen] = useState(true);

  const selectedPage = useMemo(() => pages.find(p => p.id === selectedId) ?? null, [pages, selectedId]);
  const personalPages: NotionPageItem[] = pages;

  const goConnect = () => {
    window.location.href = '/api/notion/connect';
  };

  const loadPages = async (query = '') => {
    setErrorText('');
    setStatusText('');
    setLoadingPages(true);

    try {
      const res = await fetch(`/api/notion/pages?q=${encodeURIComponent(query)}`, { method: 'GET' });
      const data = (await res.json()) as PagesResponse;

      if (!res.ok || 'error' in data) {
        if ('error' in data && data.error === 'NOT_CONNECTED') {
          setErrorText('“Notion 공유 스페이스 설정하기”');
          setStep('HOME');
          return;
        }
        const msg = 'error' in data ? `${data.error}${data.detail ? `: ${data.detail}` : ''}` : 'PAGES_FETCH_FAILED';
        throw new Error(msg);
      }

      setPages(data.pages ?? []);
      setSelectedId('');
      setStep('PICK');
      setStatusText('발행할 페이지를 선택해주세요.');
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : '페이지를 불러오지 못했습니다.');
      setStep('HOME');
    } finally {
      setLoadingPages(false);
    }
  };

  const publish = async () => {
    if (!selectedPage) {
      setErrorText('발행할 페이지를 선택해주세요.');
      return;
    }
    if (!markdown?.trim()) {
      setErrorText('발행할 내용이 없습니다.');
      return;
    }

    setErrorText('');
    setStatusText('발행 중…');
    setStep('PUBLISHING');

    try {
      const res = await fetch('/api/notion/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle?.trim() || 'Untitled',
          markdown,
          parent_page_id: selectedPage.id,
        }),
      });

      const data = (await res.json()) as PublishResponse;

      if (!res.ok || !data.ok) {
        const msg = !data.ok ? data.message : 'PUBLISH_FAILED';
        throw new Error(msg);
      }

      if (data.page?.url) window.open(data.page.url, '_blank', 'noopener,noreferrer');

      closeModal();
      router.push(`/post/${postId}`);
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : '발행에 실패했어.');
      setStep('PICK');
    }
  };

  // Step 0: HOME
  if (step === 'HOME') {
    return (
      <div className="flex w-full flex-col gap-4">
        {errorText && <p className="rounded bg-info px-3 py-2 text-sm text-primary">{errorText}</p>}

        <div className="flex flex-col gap-2">
          <button type="button" className="h-10 w-full rounded-sm bg-black text-sm font-semibold text-white hover:bg-hover disabled:bg-disabled" onClick={goConnect}>
            Notion 공유 스페이스 설정하기
          </button>

          <button type="button" className="h-10 w-full rounded-sm border border-input-stroke bg-white text-sm font-semibold text-primary hover:bg-muted disabled:opacity-60" onClick={() => loadPages(q)} disabled={loadingPages}>
            {loadingPages ? '불러오는 중…' : 'Notion 페이지 선택하기'}
          </button>
        </div>

        <p className="text-[11px] text-placeholder">* 연결(공유 스페이스 설정)은 Notion에서 “액세스 허용” 선택하기.</p>
      </div>
    );
  }

  // Step 1: PICK
  if (step === 'PICK') {
    return (
      <div className="flex w-full flex-col gap-4">
        {/* 검색 */}
        <div className="flex h-10 items-center gap-2 rounded-sm border border-input-stroke bg-white px-3">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="페이지 검색" className="w-full text-sm outline-none placeholder:text-placeholder" />
          <button type="button" className="shrink-0 rounded-xs border border-input-stroke px-3 py-1 text-sm font-medium hover:bg-muted disabled:opacity-60" onClick={() => loadPages(q)} disabled={loadingPages}>
            {loadingPages ? '...' : '검색'}
          </button>
        </div>

        {errorText && <p className="rounded bg-info px-3 py-2 text-sm text-primary">{errorText}</p>}

        {/* 페이지 선택 박스 */}
        <div className="rounded-sm border border-base-stroke bg-white">
          {/* 헤더 */}
          <button type="button" className="flex w-full items-center justify-between border-b border-base-stroke px-4 py-3 text-left hover:bg-muted" onClick={() => setIsPersonalOpen(v => !v)}>
            <p className="text-sm font-medium text-primary">페이지 선택</p>
            <span className="text-sm text-placeholder">{isPersonalOpen ? '▾' : '▸'}</span>
          </button>

          {/* ✅ 리스트 높이 고정 + 내부 스크롤 */}
          {isPersonalOpen && (
            <div className="max-h-[420px] overflow-auto">
              {personalPages.length === 0 ? (
                <div className="px-4 py-6 text-sm text-placeholder">표시할 페이지가 없습니다.</div>
              ) : (
                <ul className="flex flex-col">
                  {personalPages.map(p => (
                    <li key={p.id} className="border-t border-base-stroke first:border-t-0">
                      <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted">
                        <input type="radio" name="notionPage" className="h-4 w-4" checked={selectedId === p.id} onChange={() => setSelectedId(p.id)} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-primary">{p.title || 'Untitled'}</p>
                          {/* 원하면 최근편집 표시 켜도 됨 */}
                          {p.lastEditedTime ? <p className="mt-0.5 text-[11px] text-placeholder">최근 편집: {formatKST(p.lastEditedTime)}</p> : null}
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* ✅ 하단 버튼 정렬/라인 고정 */}
          <div className="flex items-center justify-between gap-3 border-t border-base-stroke px-4 py-3">
            <button type="button" className="h-10 w-1/2 rounded-sm border border-input-stroke bg-white text-sm font-semibold hover:bg-muted" onClick={() => setStep('HOME')}>
              뒤로 가기
            </button>

            <button type="button" className="h-10 w-1/2 rounded-sm bg-black text-sm font-semibold text-white hover:bg-hover disabled:bg-disabled" onClick={publish} disabled={!selectedPage}>
              페이지 발행
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: PUBLISHING
  return (
    <div className="flex w-full flex-col gap-3">
      <p className="text-sm text-secondary">{statusText || '발행 중…'}</p>
      <div className="h-2 w-full overflow-hidden rounded bg-keyword">
        <div className="h-full w-2/3 animate-pulse bg-black" />
      </div>
      <p className="text-[11px] text-placeholder">발행중...</p>
    </div>
  );
}
