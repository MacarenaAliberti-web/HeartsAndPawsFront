"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

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
  const router = useRouter();

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
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "email") {
      if (!value.trim()) error = "El email es obligatorio";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Email no válido";
    }

    if (name === "password") {
      if (!value) error = "La contraseña es obligatoria";
      else if (value.length < 8) error = "Debe tener al menos 8 caracteres";
    }

    if (name === "phone") {
      if (!value) error = "El teléfono es obligatorio";
      else if (!/^\d{7,15}$/.test(value)) error = "Debe ser numérico (7-15 dígitos)";
    }

    if (["nombre", "address", "city", "country", "description"].includes(name)) {
      if (!value.trim()) error = `El campo ${name} es obligatorio`;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    Object.entries(formData).forEach(([name, value]) => {
      validateField(name, value);
      if (!value.trim()) newErrors[name] = `El campo ${name} es obligatorio`;
    });

    if (!imagenPerfil) newErrors.imagenPerfil = "La imagen de perfil es obligatoria";
    if (!archivoVerificacion) newErrors.archivoVerificacion = "El archivo de verificación es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor completa todos los campos correctamente.");
      return;
    }

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
        toast.error("Error al registrar ONG. Intenta nuevamente.");
        return;
      }

      toast.success("ONG registrada con éxito");

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
      router.push("/login/loginONG");
    } catch (err) {
      console.error("Error de red o servidor:", err);
      toast.error("Ocurrió un error al conectar con el servidor");
    }
  };

  const fields: { name: keyof FormDataType; label: string; type?: string }[] = [
    { name: "nombre", label: "Nombre" },
    { name: "email", label: "Email", type: "email" },
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
        <h2 className="text-3xl font-bold text-pink-600 text-center">Registro de ONG</h2>

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

        {/* Contraseña con ícono mostrar/ocultar */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full border rounded-md px-4 py-2 pr-10 focus:ring-2 focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-pink-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Descripción */}
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

        {/* Imagen perfil */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Imagen de perfil
          </label>
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
          {errors.imagenPerfil && (
            <p className="text-red-600 text-sm mt-1">{errors.imagenPerfil}</p>
          )}
        </div>

        {/* Archivo de verificación */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Archivo de verificación (PDF)
          </label>
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
