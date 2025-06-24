/*"use client";

import { createClient } from "@supabase/supabase-js";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  alert('Inicio Login');
  const router = useRouter();

  const loginWithGoogle = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase URL or Anon Key is not defined in environment variables."
      );
    }


  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  alert('Inicio Error');

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
     redirectTo: `${window.location.origin}/dashboard`,     
    },
  });

  if (error) {
    console.error("Error al iniciar sesión:", error.message);
  }
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log(error + "" + sessionError);

  if (session) {
    const jwt = session.access_token;
    console.log("JWT:", jwt);

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.push("/dashboard");
      }
    };
    checkSession();
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
*/
"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient"

export default function LoginPage() {
  //alert('LoginSupabase');
  const router = useRouter();

  const loginWithGoogle = async () => {
    //const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    //const supabaseAnonKey =  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    
    //const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log(error + '' + sessionError);

    if (session) {
      const jwt = session.access_token;
      console.log("JWT:", jwt);
    }
  };

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    //const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey =  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();      
      console.log('Esto es DATA: ' + JSON.stringify(data));
      console.log('SESSION: ' + JSON.stringify(data?.session));

      if (data?.session) {
        console.log('VOY A DASHBOARD');
        router.push("/dashboard");
      }
    };
    checkSession();
  }, []);

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
