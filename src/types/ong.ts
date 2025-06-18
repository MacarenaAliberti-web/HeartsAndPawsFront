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
  email: string;
  name: string;
  role: "ong";
  token?: string;
};

export type ContextType = {
  ong: OngUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};