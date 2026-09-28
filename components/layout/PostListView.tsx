// components/layout/PostListView.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { usePostStore } from '@/stores/post-store';
import type { Post } from '@/types/post';

export default function PostListView({ posts }: { posts: Post[] }) {
  const { selectPostId, isChanged } = usePostStore();
  const pathname = usePathname();

  if (posts.length === 0) {
    return <div className="flex h-full justify-center text-primary">아직 작성한 블로그가 없습니다.</div>;
  }

  return (
    <ul>
      {posts.map(post => {
        const isActive = pathname === `/post/${post.id}`;
        return (
          <li key={post.id}>
            <Link href={`/post/${post.id}`} onClick={() => selectPostId(post.id)} className={`flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-2 hover:bg-base-stroke pc:p-2 ${isActive ? 'bg-base-stroke' : ''}`} aria-current={isActive ? 'page' : undefined}>
              {isActive && isChanged && (
                <div className="h-1 w-1 shrink-0 rounded-full bg-red-500">
                  <span className="sr-only">수정 중</span>
                </div>
              )}
              <p className="truncate">{post.topic}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
