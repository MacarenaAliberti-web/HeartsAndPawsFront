"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

type Usuario = {
  id: number;
  name: string;
  email: string;
  role: "usuario";
  token?: string;
};

type UsuarioContextType = {
  usuario: Usuario | null;
  loginUsuario: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const UsuarioAuthContext = createContext<UsuarioContextType | undefined>(undefined);

export const UsuarioAuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Restaurar desde cookie al iniciar
  useEffect(() => {
    const cookieData = getCookie("usuario_session");
    if (cookieData) {
      try {
        const user = JSON.parse(cookieData as string);
        setUsuario(user);
      } catch (e) {
        console.error("Cookie corrupta del usuario:", e);
      }
    }
  }, []);

  const loginUsuario = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3001/auth/usuarios/ingreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: password }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      setUsuario(data);
      setCookie("usuario_session", JSON.stringify(data), {
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setUsuario(null);
    deleteCookie("usuario_session");
  };

  return (
    <UsuarioAuthContext.Provider value={{ usuario, loginUsuario, logout }}>
      {children}
    </UsuarioAuthContext.Provider>
  );
};

export const useUsuarioAuth = () => {
  const ctx = useContext(UsuarioAuthContext);
  if (!ctx) throw new Error("useUsuarioAuth debe usarse dentro de UsuarioAuthProvider");
  return ctx;
};
