export interface FormularioAdopcionData {
  usuarioId: string;
  casoAdopcionId: string;
  tipoVivienda: string;
  integrantesFlia: number;
  hijos: number;
  hayOtrasMascotas: number;
  descripcionOtrasMascotas?: string;
  cubrirGastos: string;
  darAlimentoCuidados: string;
  darAmorTiempoEj: string;
  devolucionDeMascota: string;
  siNoPodesCuidarla: string;
  declaracionFinal: string;
}
