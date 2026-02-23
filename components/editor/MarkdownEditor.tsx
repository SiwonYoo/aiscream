'use client';

import { EditorContent } from '@tiptap/react';
import { MarkdownEditorProps } from '@/types/editor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { useEffect, useState } from 'react';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownEditor({ initialContent = '', streamedMarkdown, onContentChange }: MarkdownEditorProps) {
  const { editor } = useMarkdownEditor(initialContent);
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);
  const [markdownSource, setMarkdownSource] = useState(initialContent);

  // edit/preview 탭 전환 시, 현재 상태 반영
  useEffect(() => {
    if (!editor) return;

    // preview -> edit
    if (isMarkdownMode) {
      setMarkdownSource(editor.storage.markdown?.getMarkdown() || '');
    }
    // edit -> preview
    else {
      queueMicrotask(() => {
        editor.commands.setContent(markdownSource);
      });
    }
  }, [isMarkdownMode, editor]);

  // 스트리밍할 때 markdown으로 받음
  useEffect(() => {
    if (streamedMarkdown) {
      setMarkdownSource(streamedMarkdown);
    }
  }, [streamedMarkdown]);

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
      {!isMarkdownMode && <EditorContent editor={editor} className="min-h-0 flex-1 overflow-y-auto" />}
    </div>
  );
}
