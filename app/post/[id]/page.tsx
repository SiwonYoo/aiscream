import { notFound } from 'next/navigation';
import { getPostById } from '@/data/functions/post';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="p-6">
      <div className="rounded bg-gray-100 p-4">
        <h2 className="text-lg font-bold">{post.title}</h2>
        <pre className="mt-2 text-sm whitespace-pre-wrap">{post.content}</pre>
      </div>
    </div>
  );
}
