'use client';

import Loading from '@/components/common/Loading';
import { SyntheticEvent, useState } from 'react';

export default function LinkUpAi() {
  const [result, setResult] = useState(''); // 보여질 내용
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [hasError, setHasError] = useState(false); // 에러 상태

  const createBlog = async (e: SyntheticEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const blogTitle = String(formData.get('blogTitle'));
    const blogKeyword = String(formData.get('blogKeyword'));
    const blogType = String(formData.get('blogType'));
    const blogLength = String(formData.get('blogLength'));

    if (!blogTitle.trim() || !blogKeyword.trim()) {
      alert('공백만 입력할 수 없습니다');
      return;
    }

    console.log(blogLength, blogType);

    try {
      setResult('');
      setHasError(false);
      setLoading(true);
      const res = await fetch('/api/open-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: blogTitle, keyword: blogKeyword, type: blogType, length: blogLength }),
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
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="wrpper relative mx-auto flex w-360 flex-col gap-10">
          <div>
            <h2 className="text-2xl font-bold">내용</h2>
            <div className="mt-5 h-200 overflow-y-auto border border-base-stroke p-5">
              {loading && <Loading />}
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
          </div>
          <form method="post" onSubmit={createBlog} className="flex gap-6">
            <div className="flex gap-3">
              <input type="text" name="blogTitle" placeholder="타이틀을 입력해주세요." required className="border border-input-stroke px-3 py-1" />
              <input type="text" name="blogKeyword" placeholder="포함될 키워드를 입력해주세요." required className="border border-input-stroke px-3 py-1" />
              <select name="blogType" defaultValue="" required>
                <option value="" disabled>
                  타입 선택
                </option>
                <option value="tutorial">튜토리얼</option>
                <option value="til">TIL</option>
                <option value="trouble">트러블슈팅</option>
              </select>
              <select name="blogLength" defaultValue="" required>
                <option value="" disabled>
                  글 길이 선택
                </option>
                <option value="short">간단 요약</option>
                <option value="normal">보통 글</option>
                <option value="long">상세 설명</option>
              </select>
            </div>
            <button type="submit" className="cursor-pointer bg-active px-3 py-1 text-white" disabled={loading}>
              작성하기
            </button>
          </form>
        </div>
        <div className="w-full text-left">
          <button
            className="mt-5 bg-red-500 text-white"
            onClick={() => {
              setHasError(true);
            }}
          >
            에러버튼
          </button>
        </div>
      </div>
    </>
  );
}
