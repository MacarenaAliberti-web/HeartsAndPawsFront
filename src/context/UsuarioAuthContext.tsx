'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, RegisterData, AuthContextType } from '@/types/user';
import { registerUserService } from '@/services/register';
import { loginUserService } from '@/services/login';

const UsuarioAuthContext = createContext<AuthContextType | undefined>(undefined);

export const UsuarioAuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const registerUser = async (data: RegisterData) => {
    return await registerUserService(data);
  };

  const loginUsuario = async (email: string, contrasena: string) => {
    const res = await loginUserService(email, contrasena);
    if (res.ok && res.usuario) {
      setUsuario(res.usuario);
      return true;
    }
    return false;
  };

//si el logout implica alguna llamada a backend para invalidar sesión, borrar tokens en servidor, limpiar cookies, lo pasamos a logoutService.
  const logout = () => {
    setUsuario(null);
  };

  return (
    <UsuarioAuthContext.Provider value={{ usuario, registerUser, loginUsuario, logout }}>
      {children}
    </UsuarioAuthContext.Provider>
  );
};

export const useUsuarioAuth = () => {
  const context = useContext(UsuarioAuthContext);
  if (!context) throw new Error('useUsuarioAuth debe usarse dentro de UsuarioAuthProvider');
  return context;
};
