import { notFound } from 'next/navigation';
import { getPostById } from '@/data/functions/post';
import PostDetailClient from './PostDetailClient';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const post = await getPostById(id);

    if (!post)
      return {
        title: '블로그를 찾을 수 없습니다.',
        description: '블로그를 찾을 수 없습니다.',
        openGraph: {
          title: `블로그를 찾을 수 없습니다 | AiScReam`,
          description: '블로그를 찾을 수 없습니다.',
        },
      };
    const { topic } = post;

    return {
      title: topic,
      description: topic,
      openGraph: {
        title: `${topic} | AiScReam`,
        description: topic,
        url: `https://aiscream.vercel.app/post/${id}`,
        type: 'article',
        images: [{ url: '/AiScReam-OG.jpg', width: 1200, height: 630, alt: topic }],
      },
      alternates: {
        canonical: `/post/${id}`,
      },
    };
  } catch (e) {
    return {
      title: '블로그를 찾을 수 없습니다',
      description: '블로그를 찾을 수 없습니다.',
      openGraph: {
        title: `블로그를 찾을 수 없습니다. | AiScReam`,
        description: '블로그를 찾을 수 없습니다.',
      },
    };
  }
}

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
