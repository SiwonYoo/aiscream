'use client';

export default function UserPrompt() {
  return (
    <div className="px-4 py-7">
      <BlogPrompt />
    </div>
  );
}

export function BlogPrompt() {
  return (
    <div>
      <p className="text-black">블로그 내용</p>
      <input className="text-primary" type="text" placeholder="초보자를 위한 Next.js 시작하기 가이드" />
    </div>
  );
}
