import { ReactNode } from 'react';

export type EditorMode = 'preview' | 'edit';

export interface PostContent {
  title: string;
  content: string;
  hashtags: string[];
  metaDescription: string;
}

export interface EditorContextProps {
  children: ReactNode;
  initialTopic?: string;
  initialContent?: string;
  streamedMarkdown?: string;
  onContentChange?: (content: string) => void;
  initialMarkdownMode: boolean;
}
