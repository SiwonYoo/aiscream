import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { getMyPosts } from '@/data/functions/post';
import { createClient } from '@/lib/supabaseServer';

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
