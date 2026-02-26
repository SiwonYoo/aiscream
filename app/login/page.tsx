import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';

import BrandHeader from '@/components/login/BrandHeader';
import DemoModeNotice from '@/components/login/DemoModeNotice';
import LoginForm from '@/components/login/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인을 통해 AiScReam으로 블로그를 작성해보세요!',

  openGraph: {
    title: '로그인 | AiScReam',
    description: '로그인을 통해 AiScReam으로 블로그를 작성해보세요!',
    url: 'https://aiscream.vercel.app/login',
    siteName: 'AiScReam',
    type: 'website',
    images: [
      {
        url: '/AiScReam-OG.jpg',
        width: 1200,
        height: 630,
        alt: 'AiScReam 로그인',
      },
    ],
  },

  alternates: { canonical: '/login' },
};

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({
    data: { user: null },
  }));

  if (user) redirect('/post');

  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="mx-auto w-full max-w-90 px-5 md:max-w-115 md:px-0">
        <BrandHeader />
        <LoginForm />
        <DemoModeNotice />
      </div>
    </main>
  );
}
