'use client';

import { EditorContent } from '@tiptap/react';
import EditorToolbar from '@/components/editor/EditorToolbar';
import 'highlight.js/styles/github-dark.css';
import { useEditorContext } from '@/contexts/EditorContext';

export default function MarkdownEditor() {
  const { editor, isMarkdownMode, setIsMarkdownMode, markdownSource, setMarkdownSource } = useEditorContext();

  if (!editor) return null;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-4">
      <EditorToolbar editor={editor} isMarkdownMode={isMarkdownMode} setIsMarkdownMode={setIsMarkdownMode} />

      {/* markdown(edit) 모드 */}
      {isMarkdownMode && (
        <textarea
          value={markdownSource}
          onChange={e => {
            setMarkdownSource(e.target.value);
          }}
          aria-label="마크다운 편집기"
          className="min-h-0 flex-1 overflow-y-auto p-2 focus:outline-none"
        />
      )}
      {/* preview 모드 */}
      {!isMarkdownMode && (
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="absolute inset-0" />
        </div>
      )}
    </div>
  );
}
