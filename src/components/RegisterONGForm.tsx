"use client";

import { useState } from "react";

interface FormDataType {
  nombre: string;
  email: string;
  password: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export function RegisterONGForm() {
  const [formData, setFormData] = useState<FormDataType>({
    nombre: "",
    email: "",
    password: "",
    description: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const [imagenPerfil, setImagenPerfil] = useState<File | null>(null);
  const [archivoVerificacion, setArchivoVerificacion] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email no válido";

    if (!formData.password) newErrors.password = "La contraseña es obligatoria";
    else if (formData.password.length < 8)
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";

    if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";
    else if (!/^\d{7,15}$/.test(formData.phone))
      newErrors.phone = "El teléfono debe ser numérico y tener entre 7 y 15 dígitos";

    if (!formData.address.trim()) newErrors.address = "La dirección es obligatoria";
    if (!formData.city.trim()) newErrors.city = "La ciudad es obligatoria";
    if (!formData.country.trim()) newErrors.country = "El país es obligatorio";
    if (!formData.description.trim()) newErrors.description = "La descripción es obligatoria";

    if (!imagenPerfil) newErrors.imagenPerfil = "La imagen de perfil es obligatoria";
    if (!archivoVerificacion) newErrors.archivoVerificacion = "El archivo de verificación es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const copy = { ...prev };
      if (value.trim() === "") {
        copy[name] = `El campo ${name} es obligatorio`;
      } else {
        delete copy[name];
      }
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

   const dataToSend = new FormData();
dataToSend.append("nombre", formData.nombre);
dataToSend.append("email", formData.email);
dataToSend.append("contrasena", formData.password);
dataToSend.append("descripcion", formData.description); 
dataToSend.append("telefono", formData.phone); 
dataToSend.append("direccion", formData.address); 
dataToSend.append("ciudad", formData.city); 
dataToSend.append("pais", formData.country); 
if (imagenPerfil) dataToSend.append("imagenPerfil", imagenPerfil);
if (archivoVerificacion) dataToSend.append("archivoVerificacionUrl", archivoVerificacion);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/registro-ong`, {
  method: "POST",
  body: dataToSend,
});

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error en el registro:", errorData);
        alert("Error al registrar ONG");
        return;
      }

      const result = await res.json();
      console.log("ONG registrada:", result);
      alert("ONG registrada con éxito");

      // Reiniciar formulario
      setFormData({
        nombre: "",
        email: "",
        password: "",
        description: "",
        phone: "",
        address: "",
        city: "",
        country: "",
      });
      setImagenPerfil(null);
      setArchivoVerificacion(null);
      setErrors({});
    } catch (err) {
      console.error("Error de red o servidor:", err);
      alert("Ocurrió un error al conectar con el servidor");
    }
  };

  const fields: { name: keyof FormDataType; label: string; type?: string }[] = [
    { name: "nombre", label: "Nombre" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
    { name: "phone", label: "Teléfono" },
    { name: "address", label: "Dirección" },
    { name: "city", label: "Ciudad" },
    { name: "country", label: "País" },
  ];

  return (
    <div className="py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-lg border border-pink-600 space-y-6"
      >
        <h2 className="text-3xl font-bold text-pink-600 text-center">
          Registro de ONG
        </h2>

        {fields.map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-800 mb-1">
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2 focus:ring-2 focus:outline-none ${
                errors[name]
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
            />
            {errors[name] && (
              <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full border rounded-md px-4 py-2 resize-none focus:ring-2 focus:outline-none ${
              errors.description
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-pink-500"
            }`}
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Imagen de perfil
          </label>
          <div
            className={`border border-dashed rounded-md px-4 py-6 text-center bg-pink-50 hover:bg-pink-100 transition ${
              errors.imagenPerfil ? "border-red-500" : "border-pink-300"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setImagenPerfil(e.target.files?.[0] || null);
                setErrors((prev) => {
                  const copy = { ...prev };
                  if (!e.target.files?.[0]) copy.imagenPerfil = "La imagen de perfil es obligatoria";
                  else delete copy.imagenPerfil;
                  return copy;
                });
              }}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
            />
            {imagenPerfil && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: <strong>{imagenPerfil.name}</strong>
              </p>
            )}
          </div>
          {errors.imagenPerfil && (
            <p className="text-red-600 text-sm mt-1">{errors.imagenPerfil}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Archivo de verificación (PDF)
          </label>
          <div
            className={`border border-dashed rounded-md px-4 py-6 text-center bg-pink-50 hover:bg-pink-100 transition ${
              errors.archivoVerificacion ? "border-red-500" : "border-pink-300"
            }`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                setArchivoVerificacion(e.target.files?.[0] || null);
                setErrors((prev) => {
                  const copy = { ...prev };
                  if (!e.target.files?.[0]) copy.archivoVerificacion = "El archivo de verificación es obligatorio";
                  else delete copy.archivoVerificacion;
                  return copy;
                });
              }}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
            />
            {archivoVerificacion && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: <strong>{archivoVerificacion.name}</strong>
              </p>
            )}
          </div>
          {errors.archivoVerificacion && (
            <p className="text-red-600 text-sm mt-1">{errors.archivoVerificacion}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-md transition"
        >
          Registrar ONG
        </button>
      </form>
    </div>
  );
}
