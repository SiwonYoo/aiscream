'use client';

import { useMarkdownEditor } from '@/hooks/useMarkdownEditor';
import { usePostStore } from '@/stores/post-store';
import { EditorContextProps } from '@/types/editor';
import { Editor } from '@tiptap/react';
import { createContext, useContext, useEffect, useState } from 'react';

export interface EditorContextType {
  topic: string;
  setTopic: (v: string) => void;
  editor: Editor | null;
  isMarkdownMode: boolean;
  setIsMarkdownMode: (v: boolean) => void;
  markdownSource: string;
  setMarkdownSource: (v: string) => void;
  isChanged: boolean;
  syncInitialContent: () => void;
  errors: { topic: string | null; content: string | null };
  validate: () => boolean;
}

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children, initialTopic = '', initialContent = '', streamedMarkdown, initialMarkdownMode }: EditorContextProps) {
  const { editor } = useMarkdownEditor(initialContent);
  const [topic, _setTopic] = useState(initialTopic);
  const [savedTopic, setSavedTopic] = useState(initialTopic);
  const [isMarkdownMode, setIsMarkdownMode] = useState(initialMarkdownMode);
  const [markdownSource, _setMarkdownSource] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [errors, setErrors] = useState({ topic: null as string | null, content: null as string | null });

  const { setIsChanged } = usePostStore();

  // 제목/내용 변경 상태 확인
  const isChanged = topic !== savedTopic || markdownSource !== savedContent;
  // 수정완료 후, 저장된 제목/내용 동기화
  const syncInitialContent = () => {
    setSavedTopic(topic);
    setSavedContent(markdownSource);
  };

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
      _setMarkdownSource(streamedMarkdown);
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

  const validate = () => {
    const newErrors = {
      topic: topic.trim() ? null : '제목을 입력해주세요.',
      content: markdownSource.trim() ? null : '내용을 입력해주세요.',
    };
    setErrors(newErrors);
    return !newErrors.topic && !newErrors.content;
  };

  // setTopic + 에러 초기화 로직 추가
  const setTopic = (v: string) => {
    _setTopic(v);
    if (errors.topic) setErrors(prev => ({ ...prev, topic: null }));
  };

  // setMarkdownSource + 에러 초기화 로직 추가
  const setMarkdownSource = (v: string) => {
    _setMarkdownSource(v);
    setErrors(prev => (prev.content ? { ...prev, content: null } : prev));
  };

  return <EditorContext.Provider value={{ topic, setTopic, editor, isMarkdownMode, setIsMarkdownMode, markdownSource, setMarkdownSource, isChanged, syncInitialContent, errors, validate }}>{children}</EditorContext.Provider>;
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('EditorContext는 EditorProvider 내부에서만 사용할 수 있습니다.');
  return context;
}
