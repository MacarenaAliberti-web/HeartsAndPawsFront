"use client";


import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Iniciar sesión</h1>
      <button
        onClick={loginWithGoogle}
        style={{
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Iniciar sesión con Google
      </button>
    </main>
  );
}
