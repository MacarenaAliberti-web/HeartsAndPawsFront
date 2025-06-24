/*'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { createClient } from '../lib/supabaseClient'
import { SupabaseClient } from '@supabase/supabase-js'

const SupabaseContext = createContext<SupabaseClient | null>(null)

interface SupabaseProviderProps {
  children: ReactNode
}

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [client] = useState(() => createClient())

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase debe estar dentro de un SupabaseProvider')
  }
  return context
}
*/

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, Session, User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AuthContextProps {
  session: Session | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({ session: null, user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  // Obtener la sesión inicial cuando carga el componente
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
  });

  // Suscribirse a cambios de sesión
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    console.log('Evento auth:', _event, session);
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
