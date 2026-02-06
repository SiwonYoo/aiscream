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
      <p className="bg-amber-300 text-sm leading-3.5 font-semibold text-black">블로그 내용</p>
      <input className="bg-blue-300 text-primary" type="text" placeholder="초보자를 위한 Next.js 시작하기 가이드" />
    </div>
  );
}
