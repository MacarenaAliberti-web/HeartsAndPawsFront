"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabaseClient";

export default function SupabaseSessionSync() {
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔁 Evento auth:", event, session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return null;
}
