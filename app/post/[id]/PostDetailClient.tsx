'use client';

import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';
import type { Post } from '@/types/post';
import type { BlogType } from '@/types/blog-type';

export default function PostDetailClient({ post }: { post: Post }) {
  return (
    <div className="flex min-h-[93vh] flex-col pc:min-h-screen">
      <Base result={post.content ?? ''} />

      <UserPrompt
        readOnly
        initialValue={{
          blogTitle: post.topic,
          blogKeyword: post.keywords ?? [],
          blogType: post.type as BlogType,
          blogLength: post.postLength,
        }}
      />
    </div>
  );
}
