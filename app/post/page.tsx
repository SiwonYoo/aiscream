'use client';

import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';
import { createPost } from '@/data/actions/post';
import { UserPromptType } from '@/types/blog-type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PostPage() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState(''); // 보여질 내용
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasError, setHasError] = useState(false); // 에러 상태

  const router = useRouter();

  const createBlog = async ({ blogTitle, blogKeyword, blogType, blogLength }: UserPromptType) => {
    try {
      setResult('');
      setHasError(false);

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: blogTitle, keyword: blogKeyword.join(','), type: blogType, length: blogLength }),
      });
      if (!res.ok) {
        throw new Error(`서버 오류: ${res.status}`);
      }

      let topic = ''; // DB로 보낼 topic 값
      const rawTopic = res.headers.get('X-Topic');
      if (rawTopic) topic = decodeURIComponent(rawTopic);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (!reader) {
        throw new Error('스트림을 읽을 수 없습니다.');
      }

      let fullContent = ''; // 스트리밍 누적하여 전체 텍스트 받는 용도

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        setResult(prev => prev + chunk);
      }
      return { topic, fullContent };
    } catch (err) {
      console.log(err, '생성 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setHasError(true);
    }
  };

  // error.tsx로 이동하게 됨
  if (hasError) {
    throw new Error('스트리밍 중 에러 발생');
  }

  // 블로그 생성 + DB 저장
  const handleCreateBlog = async (params: UserPromptType) => {
    setLoading(true);
    try {
      const blogResult = await createBlog(params); // 만든 블로그 내용(topic, fullContent,)

      if (!blogResult) return;

      const res = await createPost({
        topic: blogResult.topic,
        title: params.blogTitle,
        keywords: params.blogKeyword,
        content: blogResult.fullContent,
        type: params.blogType,
      });

      setTopic(blogResult.topic);

      router.push(`/post/${res.post.id}`);
    } catch (err) {
      console.error('DB 저장 중 오류가 발생했습니다.', err);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Base result={result} loading={loading} initialTopic={topic} />
      <UserPrompt handleCreateBlog={handleCreateBlog} loading={loading} />
    </div>
  );
}
