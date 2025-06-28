'use client';

import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  useEffect(() => {
    const loginWithGoogle = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        console.error('Error al iniciar sesión:', error.message);
      }
    };

    loginWithGoogle();
  }, []);

  return (
    <main style={{ padding: 40 }}>
      <p>Redirigiendo a Google para iniciar sesión...</p>
    </main>
  );
}
