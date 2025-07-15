"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session, User } from "@supabase/supabase-js";
import { fetchConToken } from "@/services/saveToken";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextProps {
  session: Session | null;
  user: User | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  token: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const syncToken = async (session: Session | null) => {
      if (!session) return;

      const token = session.access_token;
      setToken(token); 
      console.log("Access token actualizado:", token);

      try {
        const res = await fetchConToken(token);
        console.log("Token sincronizado con éxito:", res);
      } catch (error) {
        console.error("Error al sincronizar token:", error);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log('soy la session suapabase: ' + JSON.stringify(session));
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null); 
      syncToken(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Cambio de auth:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null); 
      syncToken(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
