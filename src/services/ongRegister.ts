import { OngFormDataType } from "@/types/ong";

export async function registerOng(
  formData: OngFormDataType,
  imagenPerfil: File | null,
  archivoVerificacion: File | null
): Promise<void> {
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

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/registro-ong`, {
    method: "POST",
    body: dataToSend,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al registrar ONG");
  }
}
