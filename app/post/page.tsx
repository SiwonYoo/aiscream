'use client';

import { usePostStore } from '@/stores/post-store';

export default function PostPage() {
  const { selectedPost } = usePostStore();

  return (
    <>
      <div className="p-6">
        {!selectedPost ? (
          <div></div>
        ) : (
          <div className="rounded bg-gray-100 p-4">
            <h2 className="text-lg font-bold">{selectedPost.title}</h2>
            <pre className="mt-2 text-sm whitespace-pre-wrap">{selectedPost.content}</pre>
          </div>
        )}
      </div>
    </>
  );
}
