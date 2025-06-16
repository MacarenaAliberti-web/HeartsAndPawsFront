"use client";


import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

type OngUser = {
  email: string;
  name: string;
  role: "ong";
  token?: string;
};

type ContextType = {
  ong: OngUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const OngAuthContext = createContext<ContextType | undefined>(undefined);

export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
  const [ong, setOng] = useState<OngUser | null>(null);

  // Restaurar sesión desde cookie al cargar
  useEffect(() => {
    const cookieData = getCookie("ong_session");
    if (cookieData) {
      try {
        const user = JSON.parse(cookieData as string);
        setOng(user);
      } catch (e) {
        console.error("Cookie corrupta:", e);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:3001/auth/organizaciones/ingreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena: password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      setOng(data);
      setCookie("ong_session", JSON.stringify(data), {
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = () => {
    setOng(null);
    deleteCookie("ong_session");
  };

  return (
    <OngAuthContext.Provider value={{ ong, login, logout }}>
      {children}
    </OngAuthContext.Provider>
  );
};

export const useOngAuth = () => {
  const ctx = useContext(OngAuthContext);
  if (!ctx) throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
  return ctx;
};
