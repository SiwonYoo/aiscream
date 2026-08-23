'use client';

import EditorPlaceholder from '@/components/editor/EditorPlaceholder';
import dynamic from 'next/dynamic';

const EditorWorkspace = dynamic(() => import('@/components/editor/EditorWorkspace'), {
  ssr: false,
  loading: () => <div className="flex flex-1 items-center justify-center">불러오는 중...</div>,
});

export default function Base({ initialTopic, result, loading = false, defaultPreview = false }: { initialTopic: string; result: string; loading?: boolean; defaultPreview?: boolean }) {
  return (
    <>
      {!result && !loading && <EditorPlaceholder />}
      {(result || loading) && <EditorWorkspace initialTopic={initialTopic} result={result} loading={loading} defaultPreview={defaultPreview} />}
    </>
  );
}
