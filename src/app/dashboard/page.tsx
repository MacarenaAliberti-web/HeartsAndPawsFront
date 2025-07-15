"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyUser } from "@/services/direccionamiento";
import { useAuth } from "@/components/SupabaseProvider"; 

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return; 
    async function checkUsuario() {
      console.log("Llamando getMyUser con token:", token);
      const usuario = await getMyUser(token??undefined);

      if (!usuario) {
        console.warn("No se pudo obtener el usuario");
        return;
      }

      console.log('PAGE : ' + usuario.rol);
      if (usuario.rol === "ADMIN") {
        router.push("/dashboard/admin");
      } else if (usuario.rol === "ong") {
        router.push("/dashboard/ong");
      } else {
        router.push("/dashboard/usuario");
      }
    }

    checkUsuario();
  }, [token, router]);

  return <div>Cargando y redirigiendo...</div>;
}
