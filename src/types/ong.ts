export interface OngFormDataType {
  nombre: string;
  email: string;
  contrasena: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

// OngAuthContext.tsx
export type OngUser = {
  id: string;
  nombre: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  plan: string;
  imagenPerfil: string;
};

export interface ContextType {
  ong: OngUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;  // <-- agregá esta línea
}


// export type ContextType = {
//   ong: OngUser | null;
//   login: (email: string, password: string) => Promise<boolean>;
//   logout: () => void;
// };