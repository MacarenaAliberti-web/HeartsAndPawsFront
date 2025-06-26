
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { getMyUser } from "@/services/direccionamiento";
import { User, Session } from "@supabase/supabase-js";

export default function DashboardPage() {
  
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  // const supabase = createClient();

  useEffect(() => {
    async function checkSessionAndRedirect(session: Session) {
      console.log("SESSION: " + session);
       console.log("SESSION: " + sessionUser);
      //if (!session) return;

      setSessionUser(session.user);

      try {
        const usuario = await getMyUser();

        if (usuario.rol === "ADMIN") {
          console.log("Rol ADMIN");
        
          router.push("/dashboard/admin");
        } else if (usuario.rol === "ong") {
          console.log("Rol ONG");
          router.push("/dashboard/ong");
        } else {
          console.log("Rol USER");
          router.push("/dashboard/usuario");
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        // router.push("/login");
      }
    }

   
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);

      if (session) {
        checkSessionAndRedirect(session);
      } else {
        //router.push("/login");
      }
    });

 
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkSessionAndRedirect(session);
      }
      setLoading(false); 
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) return <div>Cargando...</div>;

  return <div>Redirigiendo...</div>;
}
