import { notFound } from 'next/navigation';
import { getPostById } from '@/data/functions/post';
import PostDetailClient from './PostDetailClient';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const post = await getPostById(id);

    if (!post) notFound();

    return <PostDetailClient post={post} />;
  } catch (e) {
    notFound();
  }
}
