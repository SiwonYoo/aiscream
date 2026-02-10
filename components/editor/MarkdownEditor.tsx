'use client';

import { MarkdownEditorProps } from '@/types/editor';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import { Markdown } from 'tiptap-markdown';

// lowlight 인스턴스 생성 (common: 주요 언어 묶음)
const lowlight = createLowlight(common);

const mockContent = `
# React useState 완벽 가이드
React의 가장 기본적인 Hook인 useState를 알아봅시다.
## useState란?
<b>useState</b>는 <b>함수형 컴포넌트</b>에서 <em>상태를 관리</em>할 수 있게 해주는 Hook입니다.</p>
<pre><code class="language-javascript">const [count, setCount] = useState(0);</code></pre>
<h1>dfsdf</h1>
`;

export default function MarkdownEditor({ initialContent = mockContent, onContentChange }: MarkdownEditorProps) {
  // TipTap 에디터 인스턴스 생성
  const editor = useEditor({
    // 0. SSR 환경에서 hydration mismatch 방지
    immediatelyRender: false,

    // 1. extensions: 에디터에 추가할 기능
    extensions: [
      // StarterKit: TipTap의 기본 기능 묶음 (Bold, Italic, Strike 등)
      StarterKit.configure({
        codeBlock: false, // codeBlockLowlight로 대체
      }),

      // CodeBlockLowlight: 문법 하이라이팅이 적용된 코드 블록
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript', // 기본 언어 js로 설정
      }),

      // Markdown: 마크다운 입출력 지원
      Markdown.configure({
        transformCopiedText: true,
      }),
    ],

    // 2. content: 에디터 초기 내용
    content: initialContent,

    // 3. editorProps: 에디터 DOM에 적용할 속성
    editorProps: {
      attributes: {
        class: 'prose prose-sm min-w-full p-2',
      },
    },

    // 4. onUpdate: 내용 변경 감지
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);

      const markdown = editor.storage.markdown?.getMarkdown();
      console.log(markdown);
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
