'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/stores/modal-store';
import { getOrCreateInstallId } from '@/lib/installId';
import { useEditorContext } from '@/contexts/EditorContext';

type Step = 'HOME' | 'PICK' | 'PUBLISHING';

type NotionPageItem = {
  id: string;
  title: string;
  url: string;
  lastEditedTime?: string;
};

type PagesResponse = { pages: NotionPageItem[] } | { error: 'NOT_CONNECTED' | 'UNAUTHORIZED' | 'DB_ERROR' | 'NOTION_API_ERROR' | 'MISSING_INSTALL_ID'; detail?: string };

type PublishResponse = { ok: true; page: { id: string; url: string } } | { ok: false; message: string };

export default function NotionPublishModal({ postId, postTitle, markdown, autoPick = false }: { postId: string; postTitle: string; markdown: string; autoPick?: boolean }) {
  const router = useRouter();
  const closeModal = useModalStore(s => s.closeModal);
  const [step, setStep] = useState<Step>('HOME');
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [pages, setPages] = useState<NotionPageItem[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const autoPickRan = useRef(false);
  const [isPersonalOpen, setIsPersonalOpen] = useState(true);
  const selectedPage = useMemo(() => pages.find(p => p.id === selectedId) ?? null, [pages, selectedId]);
  const personalPages: NotionPageItem[] = pages;

  const goConnect = () => {
    const installId = getOrCreateInstallId();
    const returnTo = window.location.pathname + window.location.search;
    const resume = 'notion_pick';

    const qs = new URLSearchParams({
      install_id: installId,
      return_to: returnTo,
      resume,
    });

    window.location.assign(`/api/notion/connect?${qs.toString()}`);
  };

  const loadPages = async (query = '') => {
    setErrorText('');
    setStatusText('');
    setLoadingPages(true);

    try {
      const installId = getOrCreateInstallId();

      const res = await fetch(`/api/notion/pages?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'x-install-id': installId,
        },
      });

      const data = (await res.json()) as PagesResponse;

      if (!res.ok || 'error' in data) {
        if ('error' in data && data.error === 'NOT_CONNECTED') {
          setErrorText('“Notion 공유 스페이스 설정하기”');
          setStep('HOME');
          return;
        }
        if ('error' in data && data.error === 'MISSING_INSTALL_ID') {
          setErrorText('새로고침 후 다시 시도해주세요.');
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

  useEffect(() => {
    if (!autoPick) return;
    if (autoPickRan.current) return;
    autoPickRan.current = true;
    loadPages('');
  }, [autoPick]);

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
      const installId = getOrCreateInstallId();

      const res = await fetch('/api/notion/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-install-id': installId,
        },
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

      router.refresh();
      closeModal();
    } catch (e) {
      setErrorText(e instanceof Error ? e.message : '발행에 실패했어.');
      setStep('PICK');
    }
  };

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

  if (step === 'PICK') {
    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex h-10 items-center gap-2 rounded-sm border border-input-stroke bg-white px-3">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="페이지 검색" className="w-full text-sm outline-none placeholder:text-placeholder" />
          <button type="button" className="shrink-0 rounded-xs border border-input-stroke px-3 py-1 text-sm font-medium hover:bg-muted disabled:opacity-60" onClick={() => loadPages(q)} disabled={loadingPages}>
            {loadingPages ? '...' : '검색'}
          </button>
        </div>

        {errorText && <p className="rounded bg-info px-3 py-2 text-sm text-primary">{errorText}</p>}

        <div className="rounded-sm border border-base-stroke bg-white">
          <button type="button" className="flex w-full items-center justify-between border-b border-base-stroke px-4 py-3 text-left hover:bg-muted" onClick={() => setIsPersonalOpen(v => !v)}>
            <p className="text-sm font-medium text-primary">페이지 선택</p>
            <span className="text-sm text-placeholder">{isPersonalOpen ? '▾' : '▸'}</span>
          </button>

          {isPersonalOpen && (
            <div className="max-h-105 overflow-auto">
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
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
