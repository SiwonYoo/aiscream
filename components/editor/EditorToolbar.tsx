'use client';

import { Editor, useEditorState } from '@tiptap/react';
import Image from 'next/image';

export default function EditorToolbar({ editor }: { editor: Editor }) {
  // 활성화 상태 구독
  const editorState = useEditorState({
    editor,
    selector: ({ editor }: { editor: Editor }) => {
      return {
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
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
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} aria-label="실행 취소" className={!editorState.canUndo ? 'cursor-not-allowed opacity-30' : ''}>
        <Image src="/assets/images/ico_undo.svg" width={14} height={14} alt="" className="min-w-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} aria-label="다시 실행" className={!editorState.canRedo ? 'cursor-not-allowed opacity-30' : ''}>
        <Image src="/assets/images/ico_redo.svg" width={14} height={14} alt="" className="min-w-4" />
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editorState.isH1 ? activeStyle : ''} aria-label="제목 1">
        H1
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editorState.isH2 ? activeStyle : ''} aria-label="제목 2">
        H2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editorState.isH3 ? activeStyle : ''} aria-label="제목 3">
        H3
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`font-bold ${editorState.isBold ? activeStyle : ''}`} aria-label="굵게">
        B
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`italic ${editorState.isItalic ? activeStyle : ''}`} aria-label="기울임꼴">
        I
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`line-through ${editorState.isStrike ? activeStyle : ''}`} aria-label="취소선">
        S
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={`font-mono ${editorState.isCode ? activeStyle : ''}`} aria-label="인라인 코드">
        Code
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editorState.isCodeBlock ? activeStyle : ''} aria-label="코드 블록">
        Code Block
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editorState.isBulletList ? activeStyle : ''} aria-label="글머리 기호 목록">
        • List
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editorState.isOrderedList ? activeStyle : ''} aria-label="번호 매기기 목록">
        1. List
      </button>

      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editorState.isBlockquote ? activeStyle : ''} aria-label="인용구">
        Quote
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} aria-label="구분선 삽입">
        ---
      </button>
    </div>
  );
}
