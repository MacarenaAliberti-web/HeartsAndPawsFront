'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { OngUser, ContextType } from "@/types/ong";
import { ongLoginService } from '@/services/ongLogin';


const OngAuthContext = createContext<ContextType | undefined>(undefined);

export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
  const [ong, setOng] = useState<OngUser | null>(null);
 



  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await ongLoginService(email, password);
    if (res.ok && res.ong) {
      setOng(res.ong);
         
      return true;
    }
    return false;
  };


  //si el logout implica alguna llamada a backend para invalidar sesión, borrar tokens en servidor, limpiar cookies, lo pasamos a logoutService.
  const logout = () => { 
    setOng(null);
   
  };

  return (
    <OngAuthContext.Provider value={{ ong, login, logout, }}>
      {children}
    </OngAuthContext.Provider>
  );
};

export const useOngAuth = () => {
  const ctx = useContext(OngAuthContext);
  if (!ctx) throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
  return ctx;
};
