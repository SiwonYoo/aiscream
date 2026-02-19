'use client';

import Editor from '@/components/editor/Editor';
import UtilButtonList from '@/components/editor/UtilButtonList';
import UserPrompt from '@/components/userinput/UserPrompt';
import type { Post } from '@/types/post';

export default function PostDetailClient({ post }: { post: Post }) {
  return (
    <div className="flex min-h-[93vh] flex-col pc:min-h-screen">
      <Editor key={post.id} post={post} />
      <UtilButtonList />
      <UserPrompt />
    </div>
  );
}
