'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Usuario,
  RegisterData,
  AuthContextType,
} from '@/types/user';
import { registerUserService } from '@/services/register';
import { loginUserService } from '@/services/login';
import { getMyUser } from '@/services/direccionamiento';
import { logoutService } from '@/services/logout';
import { useRouter } from 'next/navigation';

const UsuarioAuthContext = createContext<AuthContextType | undefined>(undefined);

export const UsuarioAuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const logged: boolean = userLogged;
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const data = await getMyUser();
        if (data && (data.id || data.usuario)) {
          const usuarioData = data.usuario || data; // compatible con ambas estructuras
          setUsuario(usuarioData);
          setUserLogged(true);
        } else {
          setUsuario(null);
        }
      } catch (error) {
        console.log('Error al cargar usuario', error);
        setUsuario(null);
      } finally {
        setLoading(false);
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
      try {
        const data = await getMyUser();
        if (data && data.id) {
          setUsuario(data);
          setUserLogged(true);
          return true;
        }
      } catch (error) {
        console.log('Error al obtener usuario luego del login', error);
      }
    }
    return false;
  };

  const logout = async () => {
    setLoading(true);
    const success = await logoutService();
    if (success) {
      setUsuario(null);
      setUserLogged(false);
      router.push('/');
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('👤 Usuario actualizado:', usuario);
  }, [usuario]);

  return (
    <UsuarioAuthContext.Provider
      value={{ usuario, registerUser, loginUsuario, logout, logged, loading }}
    >
      {children}
    </UsuarioAuthContext.Provider>
  );
};

export const useUsuarioAuth = () => {
  const context = useContext(UsuarioAuthContext);
  if (!context) throw new Error('useUsuarioAuth debe usarse dentro de UsuarioAuthProvider');
  return context;
};
