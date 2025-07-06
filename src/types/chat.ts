export interface Mensaje {
  id: string;
  contenido: string;
  autor: {
    id: string;
    nombre: string;
  };
  enviado_en: string; // ← usar directamente la propiedad del backend
}







// export interface Mensaje {
//   id: string;
//   contenido: string;
//   autor: {
//     id: string;
//     nombre: string;
//   };
// }
