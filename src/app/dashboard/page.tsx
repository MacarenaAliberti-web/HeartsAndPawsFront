// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyUser } from "@/services/direccionamiento";
import { useUser } from "@auth0/nextjs-auth0/client";
import OngDashboard from "@/components/OngDashboard";
import UsuarioDashboard from "@/components/UsuarioDashboard";
import AdminDashboard from "@/components/componentsadmin/AdminDashboard";
import { getUserRole } from '../../utils/getUserRole';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    async function getUsuarioYRedirigir() {
      try {
        const res = await getMyUser();
        const usuario = res;

        if (usuario.rol === "admin") {
          router.push("/dashboard/admin");
        } else if (usuario.rol === "ong") {
          router.push("/dashboard/ong");
        } else {
          router.push("/dashboard/usuario");
        }
      } catch (error) {
        console.error("Error al obtener usuario:", error);
        router.push("/login");
      }
    }

    getUsuarioYRedirigir();
  }, [router]);

  if (isLoading) return <div>Cargando...</div>;
  if (!user) return <div>No estás logueado</div>;

  const role = getUserRole(user);
  console.log('este es el rol: ' + role)
  if (role === "ong") return <OngDashboard />;
  if (role === "usuario") return <UsuarioDashboard />;
  if (role === "admin") return <AdminDashboard />;
  console.log('soy: ' + role);
  return <div>No tenés un rol válido</div>;
}
