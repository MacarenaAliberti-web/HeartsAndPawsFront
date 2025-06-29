"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { OngUser, ContextType } from "@/types/ong";
import { ongLoginService } from "@/services/ongLogin";

import { useRouter } from "next/navigation";
import { getMyOng } from "@/services/getMyOng";


const OngAuthContext = createContext<ContextType | undefined>(undefined);

export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [ong, setOng] = useState<OngUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    async function cargarOng() {
      try {
        const data = await getMyOng();
        if (data && data.id) {
          setOng(data);
          setLogged(true);
        } else {
          setOng(null);
        }
      } catch (error) {
        setOng(null);
      } finally {
        setLoading(false);
      }
    }

    cargarOng();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await ongLoginService(email, password);
    if (res.ok) {
      try {
        const data = await getMyOng(); // verificamos si se seteó la cookie del backend
        if (data && data.id) {
          setOng(data);
          setLogged(true);
          return true;
        }
      } catch (error) {
        console.error("Error después del login:", error);
      }
    }
    return false;
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/auth/cerrarSesion", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setOng(null);
      setLogged(false);
      setLoading(false);
      router.push("/");
    }
  };

  return (
    <OngAuthContext.Provider
      value={{ ong, login, logout, logged, loading }}
    >
      {children}
    </OngAuthContext.Provider>
  );
};

export const useOngAuth = () => {
  const context = useContext(OngAuthContext);
  if (!context)
    throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
  return context;
};
