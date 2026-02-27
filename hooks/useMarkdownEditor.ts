import CustomCodeBlock from '@/components/editor/CustomCodeBlock';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { common, createLowlight } from 'lowlight';
import Link from '@tiptap/extension-link';
import { CodeBlockTabExtension } from '@/extensions/CodeBlockTab';

import 'highlight.js/styles/github-dark.css';
import { Markdown } from 'tiptap-markdown';

const lowlight = createLowlight(common);

export function useMarkdownEditor(initialContent: string) {
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
      CodeBlockLowlight.extend({
        addNodeView() {
          // 코드 블럭 커스텀
          return ReactNodeViewRenderer(CustomCodeBlock);
        },
      }).configure({
        lowlight,
        defaultLanguage: 'javascript', // 기본 언어 js로 설정
      }),

      // Link: 스타일 적용
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer text-[#6B9BD1] hover:text-[#5082C1]',
        },
      }),

      // CodeBlockTabExtension(Custom): 코드 블럭 내 tab, shift+tab 기능 추가
      CodeBlockTabExtension,

      // Markdown: 마크다운 입출력 지원
      Markdown.configure({
        transformCopiedText: true,
        transformPastedText: true,
      }),
    ],

    // 2. content: 에디터 초기 내용
    content: initialContent,

    // 3. editorProps: 에디터 DOM에 적용할 속성
    editorProps: {
      attributes: {
        class: 'prose prose-sm min-w-full h-full p-2 dark:prose-invert ',
      },
    },

    // 4. onUpdate: 내용 변경 감지
    onUpdate: () => {},
  });

  return { editor };
}
