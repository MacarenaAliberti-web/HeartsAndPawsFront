"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { OngUser, ContextType } from "@/types/ong";
import { ongLoginService } from "@/services/ongLogin";

const OngAuthContext = createContext<ContextType | undefined>(undefined);

export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
  const [ong, setOng] = useState<OngUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOng = Cookies.get("ong");
    if (storedOng) {
      try {
        setOng(JSON.parse(storedOng));
      } catch (error) {
        console.error("Error parseando cookie ONG", error);
        setOng(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const res = await ongLoginService(email, password);
    if (res.ok && res.ong) {
      setOng(res.ong);
      Cookies.set("ong", JSON.stringify(res.ong), { expires: 7 });
      return true;
    }
    return false;
  };

  const logout = () => {
    setOng(null);
    Cookies.remove("ong");
  };

  return (
    <OngAuthContext.Provider value={{ ong, login, logout, loading }}>
      {children}
    </OngAuthContext.Provider>
  );
};

export const useOngAuth = () => {
  const ctx = useContext(OngAuthContext);
  if (!ctx) throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
  return ctx;
};






// 'use client';

// import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// import { OngUser, ContextType } from "@/types/ong";
// import { ongLoginService } from '@/services/ongLogin';
// import Cookies from "js-cookie";

// const OngAuthContext = createContext<ContextType | undefined>(undefined);

// export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
//   const [ong, setOng] = useState<OngUser | null>(null);

//   // ✅ Leer cookie al montar el componente
//   useEffect(() => {
//     const storedOng = Cookies.get("ong");
//     if (storedOng) {
//       try {
//         setOng(JSON.parse(storedOng));
//       } catch (err) {
//         console.error("Error al parsear cookie ONG", err);
//       }
//     }
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     const res = await ongLoginService(email, password);
//     if (res.ok && res.ong) {
//       setOng(res.ong);
//       // ✅ Guardar en cookie
//       Cookies.set("ong", JSON.stringify(res.ong), { expires: 7 }); // expira en 7 días
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setOng(null);
//     Cookies.remove("ong"); // ✅ Borrar cookie al cerrar sesión
//   };

//   return (
//     <OngAuthContext.Provider value={{ ong, login, logout }}>
//       {children}
//     </OngAuthContext.Provider>
//   );
// };

// export const useOngAuth = () => {
//   const ctx = useContext(OngAuthContext);
//   if (!ctx) throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
//   return ctx;
// };





// 'use client';

// import { createContext, useContext, useState, ReactNode } from "react";
// import { OngUser, ContextType } from "@/types/ong";
// import { ongLoginService } from '@/services/ongLogin';


// const OngAuthContext = createContext<ContextType | undefined>(undefined);

// export const OngAuthProvider = ({ children }: { children: ReactNode }) => {
//   const [ong, setOng] = useState<OngUser | null>(null);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     const res = await ongLoginService(email, password);
//     if (res.ok && res.ong) {
//       setOng(res.ong);
//       return true;
//     }
//     return false;
//   };


//   //si el logout implica alguna llamada a backend para invalidar sesión, borrar tokens en servidor, limpiar cookies, lo pasamos a logoutService.
//   const logout = () => { 
//     setOng(null);
   
//   };

//   return (
//     <OngAuthContext.Provider value={{ ong, login, logout }}>
//       {children}
//     </OngAuthContext.Provider>
//   );
// };

// export const useOngAuth = () => {
//   const ctx = useContext(OngAuthContext);
//   if (!ctx) throw new Error("useOngAuth debe usarse dentro de OngAuthProvider");
//   return ctx;
// };
