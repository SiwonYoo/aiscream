import Base from '@/components/editor/Base';
import UserPrompt from '@/components/userinput/UserPrompt';
import type { Post } from '@/types/post';

export default function PostDetailClient({ post }: { post: Post }) {
  return (
    <div className="flex min-h-[93vh] flex-col pc:min-h-screen">
      <Base initialTopic={post.topic} result={post.content ?? ''} defaultPreview />

      <UserPrompt
        readOnly
        defaultCollapsed
        initialValue={{
          blogTitle: post.title,
          blogKeyword: post.keywords ?? [],
          blogType: post.type,
          blogLength: post.postLength ?? 'normal',
        }}
      />
    </div>
  );
}
