'use client';

import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

const getURL = () => {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/';

  // supabase requires full URL with protocol
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getURL()}auth/callback`,
      },
    });

    if (error) {
      console.error('Google 로그인 실패:', error.message);
      alert('Google 로그인 실패: ' + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />
    </div>
  );
}
