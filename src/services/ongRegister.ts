import { OngFormDataType } from "@/types/ong";

export async function registerOng(
  formData: OngFormDataType,
  imagenPerfil: File | null,
  archivoVerificacion: File | null
): Promise<{ ok: boolean; mensaje: string }> {
  const dataToSend = new FormData();
  dataToSend.append("nombre", formData.nombre);
  dataToSend.append("email", formData.email);
  dataToSend.append("contrasena", formData.contrasena);
  dataToSend.append("descripcion", formData.descripcion);
  dataToSend.append("telefono", formData.telefono);
  dataToSend.append("direccion", formData.direccion);
  dataToSend.append("ciudad", formData.ciudad);
  dataToSend.append("pais", formData.pais);

  if (imagenPerfil) dataToSend.append("imagenPerfil", imagenPerfil);
  if (archivoVerificacion) dataToSend.append("archivoVerificacionUrl", archivoVerificacion);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/registro-ong`,{
      method: "POST",
      body: dataToSend,
    });

    const response = await res.json();

    if (res.ok && response.ok) {
      return { ok: true, mensaje: response.mensaje };
    } else if (res.status === 409) {
      return { ok: false, mensaje: response.mensaje  ("El correo ya está registrado") };
    } else {
      return { ok: false, mensaje: response.mensaje ("Error al registrar ONG") };
    }
  } catch {
    return { ok: false, mensaje: "Error de red o servidor" };
  }
}