'use client';

import { EditorProvider } from '@/contexts/EditorContext';
import Loading from '@/components/common/Loading';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import UtilButtonList from '@/components/editor/UtilButtonList';

export default function EditorWorkspace({ initialTopic, result, loading, defaultPreview }: { initialTopic: string; result: string; loading: boolean; defaultPreview: boolean }) {
  return (
    <EditorProvider streamedMarkdown={result} initialTopic={initialTopic} initialContent={result} initialMarkdownMode={!defaultPreview}>
      <div className="relative flex min-h-0 flex-1 flex-col">
        {loading && <Loading />}
        <MarkdownEditor />
        <UtilButtonList />
      </div>
    </EditorProvider>
  );
}
