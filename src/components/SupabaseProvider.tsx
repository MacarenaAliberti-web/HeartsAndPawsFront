
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
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
   const supabasesession =  supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      console.log('data: ' + JSON.stringify(session));
      const token = session?.access_token;
      if (token) {
        const res = fetchConToken(token);
        console.log('soy la respuesta del token: '+res);
      }

    });
    console.log('soy la seession que tengo: ' +  supabasesession);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Evento auth:", _event, session);
      setSession(session);
      setUser(session?.user ?? null);
        

    });
   
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
