'use client'

import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';
import { UserPromptType } from '@/types/blog-type';
import { useState } from 'react';

export default function PostPage() {
    const [result, setResult] = useState(''); // 보여질 내용
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [hasError, setHasError] = useState(false); // 에러 상태

    const createBlog = async ({blogTitle, blogKeyword, blogType, blogLength}:UserPromptType) => {
  
    try {
      setResult('');
      setHasError(false);
      setLoading(true);
      const res = await fetch('/api/open-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: blogTitle, keyword: blogKeyword.join(''), type: blogType, length: blogLength }),
      });

      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error('스트림을 읽을 수 없습니다.');
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);

        setResult(prev => prev + chunk);
      }
    } catch (err) {
      console.log(err, '생성 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  // error.tsx로 이동하게 됨
  if (hasError) {
    throw new Error('스트리밍 중 에러 발생');
  }

  return (
    <div className="flex h-[93vh] flex-col pc:h-screen">
      <Base result={result} />
      <UserPrompt createBlog={createBlog} />
    </div>
  );
}
