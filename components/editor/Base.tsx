import Loading from '@/components/common/Loading';
import EditorPlaceholder from '@/components/editor/EditorPlaceholder';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import UtilButtonList from '@/components/editor/UtilButtonList';
import { EditorProvider } from '@/contexts/EditorContext';

export default function Base({ result, loading = false }: { result: string; loading?: boolean }) {
  return (
    <>
      {/* 글 생성되기 전 상태 */}
      {!result && <EditorPlaceholder />}
      {/* 글 생성 후 상태 */}
      {result && (
        <EditorProvider streamedMarkdown={result}>
          <div className="relative flex min-h-0 flex-1 flex-col">
            {loading && <Loading />}

            <MarkdownEditor />
            <UtilButtonList />
          </div>
        </EditorProvider>
      )}
    </>
  );
}
