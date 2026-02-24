import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';

import BrandHeader from '@/components/login/BrandHeader';
import DemoModeNotice from '@/components/login/DemoModeNotice';
import LoginForm from '@/components/login/LoginForm';

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
