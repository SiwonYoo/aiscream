'use client';

import { Editor, useEditorState } from '@tiptap/react';

export default function EditorToolbar({ editor }: { editor: Editor }) {
  // 활성화 상태 구독
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor }) => {
      return {
        isH1: editor.isActive('heading', { level: 1 }),
        isH2: editor.isActive('heading', { level: 2 }),
        isH3: editor.isActive('heading', { level: 3 }),
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isStrike: editor.isActive('strike'),
        isCode: editor.isActive('code'),
        isCodeBlock: editor.isActive('codeBlock'),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote: editor.isActive('blockquote'),
      };
    },
  });

  const activeStyle = 'bg-active text-white font-bold';

  return (
    <div className="flex items-center gap-1 overflow-y-auto border-b pb-2 text-sm *:rounded *:px-3 *:py-1 *:text-nowrap *:hover:bg-base-stroke *:hover:text-black">
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editorState.isH1 ? activeStyle : ''}>
        H1
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editorState.isH2 ? activeStyle : ''}>
        H2
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editorState.isH3 ? activeStyle : ''}>
        H3
      </button>

      <button onClick={() => editor.chain().focus().toggleBold().run()} className={`font-bold ${editorState.isBold ? activeStyle : ''}`}>
        B
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`italic ${editorState.isItalic ? activeStyle : ''}`}>
        I
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`line-through ${editorState.isStrike ? activeStyle : ''}`}>
        S
      </button>

      <button onClick={() => editor.chain().focus().toggleCode().run()} className={`font-mono ${editorState.isCode ? activeStyle : ''}`}>
        Code
      </button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editorState.isCodeBlock ? activeStyle : ''}>
        Code Block
      </button>

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editorState.isBulletList ? activeStyle : ''}>
        • List
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editorState.isOrderedList ? activeStyle : ''}>
        1. List
      </button>

      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editorState.isBlockquote ? activeStyle : ''}>
        Quote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>---</button>
    </div>
  );
}
