"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOngAuth } from "../context/OngAuthContext";
import toast from "react-hot-toast";

export default function LoginOng() {
  const { login } = useOngAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const success = await login(email, password);
      if (success) {
        toast.success("Login exitoso, redirigiendo...");
        router.push("/dashboard/ong");
      } else {
        toast.error("Credenciales inválidas");
      }
    } catch (error) {
      toast.error("Error de conexión, intenta nuevamente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-pink-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">
        Iniciar sesión como ONG
      </h2>

      <label className="block mb-4">
        <span className="block font-semibold mb-1 text-gray-700">Email:</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="ejemplo@correo.com"
          disabled={loading}
          required
        />
      </label>

      <label className="block mb-6 relative">
        <span className="block font-semibold mb-1 text-gray-700">Contraseña:</span>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Tu contraseña"
          disabled={loading}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] text-gray-600 hover:text-pink-600"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? (
            // ojo cerrado
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-9a8.966 8.966 0 012.292-5.708m.618 6.076a4.48 4.48 0 006.444 6.444m1.568-1.568A9.968 9.968 0 0121 10c0-1.61-.406-3.137-1.125-4.475M3 3l18 18"
              />
            </svg>
          ) : (
            // ojo abierto
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
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
    </form>
  );
}
