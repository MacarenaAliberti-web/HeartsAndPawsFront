// types/adopciones.ts

export interface SolicitudDeAdopcion {
  id: string;
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  casoAdopcion: {
    caso: {
      titulo: string;
      descripcion: string;
      mascota: {
        nombre: string;
        imagenes: { url: string }[];
      };
      ong: {
        nombre: string;
      };
    };
  };
}
