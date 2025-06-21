'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Usuario, RegisterData, AuthContextType } from '@/types/user';
import { registerUserService } from '@/services/register';
import { loginUserService } from '@/services/login';
import { getMyUser } from '@/services/direccionamiento';
import { logoutService } from '@/services/logout';

const UsuarioAuthContext = createContext<AuthContextType | undefined>(undefined);

export const UsuarioAuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const data = await getMyUser();
        if (data?.usuario) {
          setUsuario(data.usuario);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.error('Error al cargar usuario', error);
        setUsuario(null);
      }
    }
    cargarUsuario();
  }, []);

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

  const logout = async () => {
    const success = await logoutService();
    if (success) {
      setUsuario(null);
    }
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
