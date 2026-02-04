'use client';

import GoogleLoginButton from '@/components/login/GoogleLoginButton';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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
      <div>
        <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />
      </div>
    </div>
  );
}
