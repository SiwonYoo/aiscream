'use client';

import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { usePostStore } from '@/stores/post-store';
import { EditorContextProps } from '@/types/editor';
import { Editor } from '@tiptap/react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface EditorContextType {
  editor: Editor | null;
  isMarkdownMode: boolean;
  setIsMarkdownMode: (v: boolean) => void;
  markdownSource: string;
  setMarkdownSource: (v: string) => void;
  isChanged: boolean;
  syncInitialContent: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, initialContent = '', streamedMarkdown, initialMarkdownMode }: EditorContextProps) {
  const { editor } = useMarkdownEditor(initialContent);
  const [isMarkdownMode, setIsMarkdownMode] = useState(initialMarkdownMode);
  const [markdownSource, setMarkdownSource] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);

  const { setIsChanged } = usePostStore();

  const isChanged = markdownSource !== savedContent;
  const syncInitialContent = () => setSavedContent(markdownSource);

  // isChanged 상태 동기화
  useEffect(() => {
    setIsChanged(isChanged);

    return () => {
      setIsChanged(false);
    };
  }, [isChanged, setIsChanged]);

  // 스트리밍할 때 markdown으로 받음
  useEffect(() => {
    if (streamedMarkdown) {
      setMarkdownSource(streamedMarkdown);
    }
  }, [streamedMarkdown]);

  // edit -> preview 탭 전환 시, 현재 상태 반영
  useEffect(() => {
    if (!editor || isMarkdownMode) return;

    editor?.commands.setContent(markdownSource);
  }, [isMarkdownMode, editor]);

  // preview -> edit 탭 전환 시, 현재 상태 반영
  useEffect(() => {
    if (!editor || isMarkdownMode) return;
    const handleUpdate = () => {
      setMarkdownSource(editor.storage.markdown?.getMarkdown() ?? '');
    };
    editor.on('update', handleUpdate);
    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, isMarkdownMode]);

  return <EditorContext.Provider value={{ editor, isMarkdownMode, setIsMarkdownMode, markdownSource, setMarkdownSource, isChanged, syncInitialContent }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('EditorContext는 EditorProvider 내부에서만 사용할 수 있습니다.');
  return context;
}
