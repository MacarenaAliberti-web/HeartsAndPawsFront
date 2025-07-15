// src/types/auth.ts

import { Usuario } from './user'; // Asegurate de tener este tipo definido

export type LoginResponse =
  | { success: true; usuario: Usuario }
  | { success: false; error: string };
