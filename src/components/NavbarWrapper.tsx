
"use client";

import { useEffect, useState } from "react";
//import { createClient } from "../lib/supabaseClient";
import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import dynamic from "next/dynamic";
import { User } from "@supabase/supabase-js";
import { createClient } from '@supabase/supabase-js';

const NavbarSupabase = dynamic(() => import("./navbars/NavbarSupabase"), { ssr: false });
const NavbarLocal = dynamic(() => import("./navbars/NavbarLocal"), { ssr: false });

// Crear supabase solo una vez afuera del componente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NavbarWrapper = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setUser(null);
      } else {
        setUser(user);
      }

      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user);
      else setUser(null);
    });

    return () => subscription.unsubscribe();
  }, []); // array vacío ya que supabase es estable

  if (loading) return null;

  if (user) return <NavbarSupabase />;
  if (ong || usuario) return <NavbarLocal />;

  return <NavbarLocal />;
};

export default NavbarWrapper;
