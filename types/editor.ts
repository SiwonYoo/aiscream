export type EditorMode = 'preview' | 'edit';

export interface PostContent {
  title: string;
  content: string;
  hashtags: string[];
  metaDescription: string;
}

export interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export interface MarkdownPreviewProps {
  content: string;
}
