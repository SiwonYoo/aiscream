'use client';

import { EditorContent } from '@tiptap/react';
import EditorToolbar from '@/components/editor/EditorToolbar';
import 'highlight.js/styles/github-dark.css';
import { useEditorContext } from '@/contexts/EditorContext';

export default function MarkdownEditor() {
  const { topic, setTopic, editor, isMarkdownMode, setIsMarkdownMode, markdownSource, setMarkdownSource, errors } = useEditorContext();

  if (!editor) return null;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 p-4">
      <EditorToolbar editor={editor} isMarkdownMode={isMarkdownMode} setIsMarkdownMode={setIsMarkdownMode} />
      <div className="mx-auto flex w-full flex-1 flex-col gap-2 pc:max-w-300">
        {/* 제목 입력 */}
        <input type="text" value={topic} onChange={event => setTopic(event.target.value)} placeholder="제목을 입력하세요" className={`border-b border-input-stroke p-2 text-lg font-bold ${errors.topic ? 'border-red-500' : ''}`} />

        {/* 제목 미입력 에러 */}
        {errors.topic && <p className="px-2 text-sm text-red-500">{errors.topic}</p>}

        {/* markdown(edit) 모드 */}
        <textarea
          value={markdownSource}
          onChange={e => {
            setMarkdownSource(e.target.value);
          }}
          aria-label="마크다운 편집기"
          className={`min-h-0 flex-1 overflow-y-auto p-2 ${!isMarkdownMode ? 'hidden' : ''}`}
        />

        {/* preview 모드 */}
        <div className={`relative min-h-0 flex-1 focus-within:ring-2 focus-within:ring-focus ${isMarkdownMode ? 'hidden' : ''}`}>
          <div className="absolute inset-0 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* 내용 미입력 에러 */}
        {errors.content && <p className="px-2 text-sm text-red-500">{errors.content}</p>}
      </div>
    </div>
  );
}
