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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (imagenPerfil) data.append("imagenPerfil", imagenPerfil);
    if (archivoVerificacion) data.append("archivoVerificacion", archivoVerificacion);

    const res = await fetch("/api/registro-ong", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      alert("ONG registrada con éxito");
      // Aquí podrías resetear el formulario o redirigir
    } else {
      alert("Error al registrar ONG");
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
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>
        ))}

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Descripción
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Imagen de perfil
          </label>
          <div className="border border-dashed border-pink-300 rounded-md px-4 py-6 text-center bg-pink-50 hover:bg-pink-100 transition">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagenPerfil(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
              required
            />
            {imagenPerfil && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado: <strong>{imagenPerfil.name}</strong>
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Archivo de verificación (PDF)
          </label>
          <div className="border border-dashed border-pink-300 rounded-md px-4 py-6 text-center bg-pink-50 hover:bg-pink-100 transition">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setArchivoVerificacion(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
              required
            />
            {archivoVerificacion && (
              <p className="mt-2 text-sm text-gray-600">
                Archivo seleccionado:{" "}
                <strong>{archivoVerificacion.name}</strong>
              </p>
            )}
          </div>
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
