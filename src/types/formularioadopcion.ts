export interface FormularioAdopcionData {
  nombre: string;
  edad: string;
  dni: string;
  direccion: string;
  telefono: string;
  email: string;
  ocupacion: string;
  estadoCivil: string;

  tipoVivienda: string;
  conQuienVives: string;
  hijosEdades: string;
  otrosConviven: string;
  tieneMascotas: string | null;
  otrasMascotas: string;

  gastosVeterinarios: string;
  alimentacion: string;
  dedicacion: string;
  devolucionResponsable: string;
  quePasaSiNoPuedo: string;

  declaracionFinal: string;
}
