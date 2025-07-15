//types/mascota.ts
export interface Imagen {
  id: string
  url: string
}

export interface Mascota {
  id: string
  nombre: string
  tipo: string
  imagenes: Imagen[]
  descripcion: string
  casoId:string
}

export interface MascotaCardProps {
  mascota: Mascota
  onConocerHistoria?: (mascota: Mascota) => void
  onAdoptar?: (id: string) => void
}

// Esta es la que usa MascotaCard
export interface MascotaCardConModoProps extends MascotaCardProps {
  modo: 'adopcion' | 'donacion'
}

// Esta es para MascotaModal
export interface MascotaModalProps {
  mascota: Mascota
  visible: boolean
  cargando?: boolean
  onClose: () => void
  onAccion?: (id: string) => void
  modo: 'adopcion' | 'donacion'
}