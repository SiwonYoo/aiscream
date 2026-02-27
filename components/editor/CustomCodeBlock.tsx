'use client';

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import Image from 'next/image';
import { useState } from 'react';

/**
 * @param node 현재 노드의 정보
 * @param deleteNode 현재 노드를 삭제하는 함수
 * @param updateAttributes 노드의 속성을 업데이트하는 함수
 */
export default function CustomCodeBlock({ node, deleteNode, updateAttributes }: NodeViewProps) {
  const [isCopied, setIsCopied] = useState(false);

  // 언어 선택
  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascriptreact', label: 'JSX' },
    { value: 'typescriptreact', label: 'TSX' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'css', label: 'CSS' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'bash', label: 'Bash' },
    { value: 'json', label: 'JSON' },
  ];

  // 복사 기능
  const handleCopy = async () => {
    const code = node.textContent;

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('복사 실패', error);
    }
  };

  return (
    <NodeViewWrapper className="code-block group relative">
      {/* 코드 블럭 좌측 삭제 버튼 (group-hover 시 확인 가능) */}
      <button type="button" onClick={deleteNode} contentEditable={false} title="삭제하기" aria-label="코드블럭 전체 삭제하기" className="absolute -left-5.5 cursor-pointer p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Image src="/assets/images/ico_cancel.svg" width={14} height={14} alt="" className="not-prose" />
      </button>

      {/* 코드 블럭 내 상단 툴바 */}
      <div className="absolute top-2 right-2 z-1 flex gap-1">
        {/* 언어 선택 */}
        <select contentEditable={false} value={node.attrs.language || 'javascript'} onChange={e => updateAttributes({ language: e.target.value })} className="cursor-pointer rounded border border-base-stroke bg-active px-2 py-1 text-xs text-white">
          {languages.map(language => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>

        {/* 복사 버튼 */}
        <button type="button" onClick={handleCopy} contentEditable={false} title={isCopied ? '복사 완료' : '복사하기'} aria-label="복사하기" className="cursor-pointer rounded p-1">
          {isCopied ? <Image src="/assets/images/ico_check.svg" width={12} height={12} alt="" className="not-prose" /> : <Image src="/assets/images/ico_copy.svg" width={12} height={12} alt="" className="not-prose" />}
        </button>
      </div>

      <pre className="p-8 pt-10">
        <NodeViewContent />
      </pre>
    </NodeViewWrapper>
  );
}
