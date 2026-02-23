'use client';

import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { EditorContextProps } from '@/types/editor';
import { Editor } from '@tiptap/react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface EditorContextType {
  editor: Editor | null;
  isMarkdownMode: boolean;
  setIsMarkdownMode: (v: boolean) => void;
  markdownSource: string;
  setMarkdownSource: (v: string) => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, initialContent = '', streamedMarkdown }: EditorContextProps) {
  const { editor } = useMarkdownEditor(initialContent);
  const [isMarkdownMode, setIsMarkdownMode] = useState(true);
  const [markdownSource, setMarkdownSource] = useState(initialContent);

  // edit/preview 탭 전환 시, 현재 상태 반영
  useEffect(() => {
    // preview -> edit
    if (isMarkdownMode) {
      setMarkdownSource(editor?.storage.markdown?.getMarkdown() || '');
    }
    // edit -> preview
    else {
      queueMicrotask(() => {
        editor?.commands.setContent(markdownSource);
      });
    }
  }, [isMarkdownMode, editor]);

  // 스트리밍할 때 markdown으로 받음
  useEffect(() => {
    if (streamedMarkdown) {
      setMarkdownSource(streamedMarkdown);
    }
  }, [streamedMarkdown]);

  return <EditorContext.Provider value={{ editor, isMarkdownMode, setIsMarkdownMode, markdownSource, setMarkdownSource }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) throw new Error();
  return context;
}
