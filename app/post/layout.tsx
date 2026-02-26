import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { getMyPosts } from '@/data/functions/post';
import { createClient } from '@/lib/supabaseServer';
import type { Metadata } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscream.vercel.app').replace(/\/$/, '');

export const metadata: Metadata = {
  title: {
    default: '새 블로그 작성',
    template: '%s | AiScReam',
  },
  description: 'AiScReam으로 블로그 글을 작성해보세요!',
  openGraph: {
    title: '새 블로그 작성 | AiScReam',
    description: 'AiScReam으로 블로그 글을 작성해보세요!',
    url: `${siteUrl}/post`,
    siteName: 'AiScReam',
    type: 'website',
    images: [{ url: '/AiScReam-OG.jpg', width: 1200, height: 630, alt: 'AiScReam' }],
  },

  alternates: {
    canonical: `/post`,
  },
};

export default async function PostLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = await getMyPosts().catch(() => []);

  return (
    <>
      <Header />
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar initialPosts={posts} userEmail={user?.email ?? ''} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}
