"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import dynamic from "next/dynamic";



const NavbarAuth0 = dynamic(() => import("./navbars/NavbarAuth0"), { ssr: false });
const NavbarLocal = dynamic(() => import("./navbars/NavbarLocal"), { ssr: false });

const NavbarWrapper = () => {
  const { user, isLoading } = useUser();
  const { ong } = useOngAuth();
  const { usuario } = useUsuarioAuth();

  if (isLoading) return null;

  if (user) return <NavbarAuth0 />;

  if (ong || usuario) return <NavbarLocal />;

  return <NavbarLocal />;
};

export default NavbarWrapper;
