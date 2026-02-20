import EditorPlaceholder from '@/components/editor/EditorPlaceholder';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import UtilButtonList from '@/components/editor/UtilButtonList';

export default function Base({result}: {result: string}) {
  return (
    <>
      {/* 글 생성되기 전 상태 */}
      {!result && <EditorPlaceholder />}
      {/* 글 생성 후 상태 */}
      {result && 
        <div className='flex flex-col flex-1 min-h-0'>
          <MarkdownEditor streamedMarkdown={result} />
          <UtilButtonList />
        </div>
      }
    </>
  );
}
