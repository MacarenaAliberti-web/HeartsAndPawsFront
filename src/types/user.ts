export interface FormDataType {
  nombre: string;
  email: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

// UsuarioAuthContext
export interface Usuario {
  nombre: string;
  email: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  contrasena: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  registerUser: (data: RegisterData) => Promise<{ ok: boolean; mensaje: string }>;
  loginUsuario: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}