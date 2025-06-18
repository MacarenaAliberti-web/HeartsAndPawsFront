"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserRole } from '../../utils/getUserRole';
import OngDashboard from "../../components/OngDashboard";
import UsuarioDashboard from "../../components/dashboard/UsuarioDashboard";
import AdminDashboard from "../../components/dashboard/AdminDashboard";

export default function DashboardRouter() {
  const { user, isLoading } = useUser();

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
