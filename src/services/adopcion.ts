import { FormularioAdopcionData } from '@/types/formularioadopcion';

export const obtenerCasoAdopcionId = async (casoId: string): Promise<string> => {
  try {
    console.log('📦 ID de mascota recibido en obtenerCasoAdopcionId:', casoId);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/casos/idAdopcion/${casoId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Error ${res.status}: ${text}`);
    }

    const data = await res.json();

    return data.casoAdopcionId || data.id || '';
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('No se pudo obtener el ID de CasoAdopcion: ' + error.message);
    }
    throw new Error('No se pudo obtener el ID de CasoAdopcion: error desconocido');
  }
};



// Define una interfaz para la respuesta que esperas del backend
export interface RespuestaAdopcion {
  message: string;
}

export const enviarSolicitudAdopcion = async (
  formData: FormularioAdopcionData,
  usuarioId: string,
  casoAdopcionId: string
): Promise<RespuestaAdopcion> => {
  try {
    const {
      tipoVivienda,
      integrantesFlia,
      hijos,
      hayOtrasMascotas,
      descripcionOtrasMascotas,
      cubrirGastos,
      darAlimentoCuidados,
      darAmorTiempoEj,
      devolucionDeMascota,
      siNoPodesCuidarla,
      declaracionFinal,
    } = formData;

    const body = {
      usuarioId,
      casoAdopcionId,
      tipoVivienda,
      integrantesFlia,
      hijos,
      hayOtrasMascotas,
      descripcionOtrasMascotas,
      cubrirGastos,
      darAlimentoCuidados,
      darAmorTiempoEj,
      devolucionDeMascota,
      siNoPodesCuidarla,
      declaracionFinal,
    };

    // Validación simple de campos obligatorios (excluye descripcionOtrasMascotas)
    for (const [key, value] of Object.entries(body)) {
      if (
        key !== 'descripcionOtrasMascotas' &&
        (value === '' || value === null || value === undefined)
      ) {
        throw new Error(`Campo obligatorio "${key}" está vacío`);
      }
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // Intenta parsear JSON para obtener el mensaje del error
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      if (errorData?.message) {
        throw new Error(errorData.message);
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error al enviar la solicitud: ' + error.message);
    }
    throw new Error('Error desconocido al enviar la solicitud');
  }
};
