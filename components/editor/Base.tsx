import Loading from '@/components/common/Loading';
import EditorPlaceholder from '@/components/editor/EditorPlaceholder';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import UtilButtonList from '@/components/editor/UtilButtonList';
import { EditorProvider } from '@/contexts/EditorContext';

export default function Base({ initialTopic, result, loading = false, defaultPreview = false }: { initialTopic: string; result: string; loading?: boolean; defaultPreview?: boolean }) {
  return (
    <>
      {/* 글 생성되기 전 상태 */}
      {!result && !loading && <EditorPlaceholder />}
      {/* 글 생성 후 상태 */}
      {(result || loading) && (
        <EditorProvider streamedMarkdown={result} initialTopic={initialTopic} initialContent={result} initialMarkdownMode={!defaultPreview}>
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* {loading && <Loading />} */}
            <Loading />
            <MarkdownEditor />
            <UtilButtonList />
          </div>
        </EditorProvider>
      )}
    </>
  );
}
