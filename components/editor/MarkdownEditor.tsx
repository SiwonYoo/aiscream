'use client';

import { EditorContent } from '@tiptap/react';
import { MarkdownEditorProps } from '@/types/editor';
import EditorToolbar from '@/components/editor/EditorToolbar';
import { useEffect } from 'react';
import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import 'highlight.js/styles/github-dark.css';


export default function MarkdownEditor({ initialContent='', streamedMarkdown, onContentChange }: MarkdownEditorProps) {

  const { editor } = useMarkdownEditor(initialContent);

  useEffect(()=>{
    if (editor && streamedMarkdown) {
      queueMicrotask(()=>{
        editor.commands.setContent(streamedMarkdown);
      })
    }
  }, [streamedMarkdown, editor])

  if (!editor) return null;

  return (
    <>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}
