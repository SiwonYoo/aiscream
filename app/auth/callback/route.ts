import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  const next = url.searchParams.get('next') ?? '/';
  const nextPath = next.startsWith('/') && !next.startsWith('//') ? next : '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', url.origin));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('[exchangeCodeForSession]', error);
    return NextResponse.redirect(new URL(`/login?error=oauth_exchange_failed&message=${encodeURIComponent(error.message)}`, url.origin));
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}
