'use client';

import { EditorContent } from '@tiptap/react';
import { MarkdownEditorProps } from '@/types/editor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { useEffect } from 'react';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import 'highlight.js/styles/github-dark.css';

export default function MarkdownEditor({ initialContent = '', streamedMarkdown, onContentChange }: MarkdownEditorProps) {
  const { editor } = useMarkdownEditor(initialContent);

  useEffect(() => {
    if (editor && streamedMarkdown) {
      queueMicrotask(() => {
        editor.commands.setContent(streamedMarkdown);
      });
    }
  }, [streamedMarkdown, editor]);

  if (!editor) return null;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-4">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-0 flex-1 overflow-y-auto" />
    </div>
  );
}
