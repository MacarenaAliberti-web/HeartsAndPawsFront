// types/casos.ts
import { Mascota } from './mascotas'

export interface Caso {
  id: string
  titulo: string
  descripcion: string
  tipo: 'ADOPCION' | 'DONACION'
  ongId: string
  mascota: Mascota
}
