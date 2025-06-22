"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FormBase from '@/components/forms/FormBase';
import { OngFormDataType } from "@/types/ong";
import { registerOng } from "@/services/ongRegister";

type ErrorsType = Partial<Record<keyof OngFormDataType | "imagenPerfil" | "archivoVerificacion", string>>;

export function RegisterONGForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<OngFormDataType>({
    nombre: "",
    email: "",
    contrasena: "",
    descripcion: "",   
    telefono: "",      
    direccion: "",     
    ciudad: "",
    pais: "",
  });

  const [imagenPerfil, setImagenPerfil] = useState<File | null>(null);
  const [archivoVerificacion, setArchivoVerificacion] = useState<File | null>(null);
  const [errors, setErrors] = useState<ErrorsType>({});
  const [showPassword, setShowPassword] = useState(false);

  // Preview imagen perfil
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imagenPerfil) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(imagenPerfil);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imagenPerfil]);

  // Validar formulario
  const obtenerErrores = (datos: OngFormDataType): ErrorsType => {
    const errores: ErrorsType = {};

    Object.entries(datos).forEach(([nombreCampo, valor]) => {
      if (!valor.trim()) {
        errores[nombreCampo as keyof OngFormDataType] = `El campo ${nombreCampo} es obligatorio`;
      } else {
        if (nombreCampo === "email") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor))
            errores.email = "Email no válido";
        }
        if (nombreCampo === "contrasena") {
          if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(valor)) {
            errores.contrasena = "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y símbolo.";
          }
        }
        if (nombreCampo === "telefono") {
          if (!/^\d{7,15}$/.test(valor))
            errores.telefono = "Debe ser numérico (7-15 dígitos)";
        }
      }
    });

    if (!imagenPerfil) errores.imagenPerfil = "La imagen de perfil es obligatoria";
    if (!archivoVerificacion) errores.archivoVerificacion = "El archivo de verificación es obligatorio";

    return errores;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar campo individual
    let error = "";
    if (!value.trim()) error = `El campo ${name} es obligatorio`;
    else {
      if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Email no válido";
      if (name === "contrasena" && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value))
        error = "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y símbolo.";
      if (name === "telefono" && !/^\d{7,15}$/.test(value))
        error = "Debe ser numérico (7-15 dígitos)";
    }

    setErrors((prev) => {
      const copia = { ...prev };
      if (error) copia[name as keyof ErrorsType] = error;
      else delete copia[name as keyof ErrorsType];
      return copia;
    });
  };

  const validarFormulario = (): boolean => {
    const errores = obtenerErrores(formData);
    setErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor completa todos los campos correctamente.");
      return;
    }

    try {
      await registerOng(formData, imagenPerfil, archivoVerificacion);
      toast.success("ONG registrada con éxito");

      setFormData({
        nombre: "",
        email: "",
        contrasena: "",
        descripcion: "",
        telefono: "",
        direccion: "",
        ciudad: "",
        pais: "",
      });
      setImagenPerfil(null);
      setArchivoVerificacion(null);
      setErrors({});
      router.push("/register/ong-registro-exitoso");
    } catch (error) {
      console.error("Error al registrar ONG:", error);
      toast.error("Error al registrar ONG. Intenta nuevamente.");
    }
  };

  const campos = [
    { name: "nombre" as const, label: "Nombre" },
    { name: "email" as const, label: "Email", type: "email" },
    { name: "telefono" as const, label: "Teléfono" },
    { name: "direccion" as const, label: "Dirección" },
    { name: "ciudad" as const, label: "Ciudad" },
    { name: "pais" as const, label: "País" },
    { name: "contrasena" as const, label: "Contraseña", type: "password" },
    { name: "descripcion" as const, label: "Descripción", multiline: true, rows: 4 },
  ];

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <FormBase
        title="Registro de ONG"
        fields={campos}
        formData={formData}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={false}
        showPasswordToggle
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      >
        {/* Imagen perfil */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Imagen de perfil
          </label>
          <label className="inline-block cursor-pointer file:sr-only bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded">
            Seleccionar imagen
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const archivo = e.target.files?.[0] || null;
                setImagenPerfil(archivo);
                setErrors((prev) => {
                  const copia = { ...prev };
                  if (!archivo) copia.imagenPerfil = "La imagen de perfil es obligatoria";
                  else delete copia.imagenPerfil;
                  return copia;
                });
              }}
              className="hidden"
            />
          </label>
          {previewUrl && (
            <div className="mt-2">
              <img
                src={previewUrl}
                alt="Vista previa de imagen de perfil"
                className="max-w-xs max-h-40 rounded-md object-contain border border-gray-300"
              />
            </div>
          )}
          {errors.imagenPerfil && (
            <p className="text-red-600 text-sm mt-1">{errors.imagenPerfil}</p>
          )}
        </div>

        {/* Archivo de verificación */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Archivo de verificación (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const archivo = e.target.files?.[0] || null;
              setArchivoVerificacion(archivo);
              setErrors((prev) => {
                const copia = { ...prev };
                if (!archivo) copia.archivoVerificacion = "El archivo de verificación es obligatorio";
                else delete copia.archivoVerificacion;
                return copia;
              });
            }}
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-pink-600 file:text-white hover:file:bg-pink-700"
          />
          {errors.archivoVerificacion && (
            <p className="text-red-600 text-sm mt-1">{errors.archivoVerificacion}</p>
          )}
        </div>
      </FormBase>
    </div>
  );
}
