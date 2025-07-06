"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authMe } from "@/services/login";

export default function LoginUsuario() {
  const router = useRouter();
  const { loginUsuario } = useUsuarioAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Bloqueo scroll al montar y restaurar al desmontar
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim()) {
    toast.error("Por favor ingresa tu email");
    return;
  }
  if (!validateEmail(email)) {
    toast.error("El formato del email no es válido");
    return;
  }
  if (!password) {
    toast.error("Por favor ingresa tu contraseña");
    return;
  }
  if (password.length < 6) {
    toast.error("La contraseña debe tener al menos 6 caracteres");
    return;
  }

  setLoading(true);
  try {
    const success = await loginUsuario(email, password);

    if (success) {
      const authme = await authMe();
      const rol = authme ? await authme.json() : {};

      switch (rol.rol) {
        case "ADMIN":
          router.push("/dashboard/admin");
          break;
        case "USUARIO":
          router.push("/dashboard/usuario");
          break;
        case "ONG":
          router.push("/dashboard/ong");
          break;
        default:
          toast.error("Credenciales inválidas");
          setLoading(false); // solo si hubo error
      }
    } else {
      setLoading(false); // en caso de login fallido
    }
  } catch (error) {
    toast.error("Error de conexión, intenta nuevamente");
    console.log(error);
    setLoading(false);
  }
};


  return (
  <>
    <form
      onSubmit={handleLogin}
      className="max-w-md p-6 mx-auto bg-white border border-pink-300 shadow-md rounded-xl"
    >
      <h2 className="mb-6 text-3xl font-bold text-center text-pink-600">
        Iniciar sesión
      </h2>

      <label className="block mb-4">
        <span className="block mb-1 font-semibold text-gray-700">Email:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="ejemplo@correo.com"
          disabled={loading}
          required
        />
      </label>

      <label className="relative block mb-6">
        <span className="block mb-1 font-semibold text-gray-700">Contraseña:</span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Tu contraseña"
          disabled={loading}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute text-gray-500 right-3 top-9"
          tabIndex={-1}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </label>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-pink-600 text-white py-3 rounded font-semibold hover:bg-pink-700 transition ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Ingresando..." : "Entrar"}
      </button>

      <div className="mt-6 text-center text-sm text-gray-600">
        ¿No tenés una cuenta?{" "}
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="text-pink-600 font-semibold hover:underline"
        >
          Registrate acá
        </button>
      </div>
    </form>

    {loading && (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
    <div className="flex flex-col items-center gap-4">
      <div className="text-center text-pink-600 font-semibold text-lg animate-pulse">
        Iniciando sesión...<br />
        Redirigiendo a tu perfil, por favor aguardá.
      </div>
      <div className="w-6 h-6 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
)}


  </>
);
}