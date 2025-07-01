// types/formsOng.ts
export interface FormInputs {
  title: string;
  description: string;
  type: "ADOPCION" | "DONACION" | "";
  donationGoal?: number;
  petId?: string;
}

export interface CasoAdopcionBody {
  titulo: string;
  descripcion: string;
  tipo: "ADOPCION";
  mascotaId: string;
  ongId: string;
}

export interface CasoDonacionBody {
  titulo: string;
  descripcion: string;
  tipo: "DONACION";
  mascotaId: string;
  ongId: string;
  donacion: {
    metaDonacion?: number;
  };
}

export type CasoBody = CasoAdopcionBody | CasoDonacionBody;

