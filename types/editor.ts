export type EditorMode = 'preview' | 'edit';

export interface PostContent {
  title: string;
  content: string;
  hashtags: string[];
  metaDescription: string;
}

export interface MarkdownEditorProps {
  initialContent?: string;
  streamedMarkdown?: string;
  onContentChange?: (content: string) => void;
}