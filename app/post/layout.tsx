import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { getMyPosts } from '@/data/functions/post';
import { createClient } from '@/lib/supabaseServer';
import type { Metadata } from 'next';
import { Suspense } from 'react';

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

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="relative flex flex-1 overflow-hidden">
        <Suspense fallback={<SidebarSkeleton />}>
          <SidebarWithData />
        </Suspense>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </>
  );
}

async function SidebarWithData() {
  const supabase = await createClient();

  // 인증 체크와 글 목록 조회를 병렬로
  const [
    {
      data: { user },
    },
    posts,
  ] = await Promise.all([supabase.auth.getUser(), getMyPosts().catch(() => [])]);

  return <Sidebar initialPosts={posts} userEmail={user?.email ?? ''} />;
}

function SidebarSkeleton() {
  return <aside className="z-10 flex w-70 shrink-0 flex-col self-stretch border-r border-base-stroke bg-muted max-pc:absolute max-pc:inset-0 max-pc:w-0 pc:h-dvh pc:w-75" />;
}
