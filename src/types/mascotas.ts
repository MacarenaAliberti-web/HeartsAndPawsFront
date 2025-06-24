export interface Imagen {
  id: string
  url: string
}

export interface Mascota {
  id: string
  nombre: string
  tipo: string
  imagenes: string[]
  descripcion: string
  edad: number
  tipoId: string
}

export interface MascotaCardProps {
  mascota: Mascota
  onConocerHistoria?: (id: string) => void
  onAdoptar?: (id: string) => void
}
