"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginUsuario() {
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
      const res = await fetch("http://localhost:3001/auth/usuarios/ingreso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, contrasena: password }), 
      });

      if (res.ok) {
        toast.success("Login exitoso, redirigiendo...");
        router.push("/dashboard/usuario"); 
      } else if (res.status === 401) {
        toast.error("Credenciales inválidas");
      } else {
        toast.error("Error en el servidor");
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
        Iniciar sesión
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
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Tu contraseña"
          disabled={loading}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-2 top-9 text-gray-500"
          tabIndex={-1}
        >
          {showPassword ? "🙈" : "👁️"}
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
