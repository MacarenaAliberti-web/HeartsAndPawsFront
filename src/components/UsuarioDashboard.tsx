'use client';

import { useState } from 'react';

interface UserData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

export default function DashboardSencillo() {
  const [seccionActiva, setSeccionActiva] = useState<'perfil' | 'datos'>('perfil');
  const [userData, setUserData] = useState<UserData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
  });

  const [isEditando, setIsEditando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = () => {
    setIsEditando(false);
    // Por ahora no hacemos backend, queda solo en estado local
  };

  return (
    <div className="min-h-screen flex bg-pink-50">
      {/* Panel lateral */}
      <nav className="w-60 bg-pink-600 text-white flex flex-col py-6 px-4">
  <h2 className="text-xl font-semibold mb-8 text-center">Panel del Usuario</h2>

  <button
    onClick={() => setSeccionActiva('perfil')}
    className={`mb-4 text-left px-3 py-2 rounded ${
      seccionActiva === 'perfil' ? 'bg-pink-800 font-semibold' : 'hover:bg-pink-700'
    }`}
  >
    Mi perfil
  </button>

  <button
    onClick={() => setSeccionActiva('datos')}
    className={`text-left px-3 py-2 rounded ${
      seccionActiva === 'datos' ? 'bg-pink-800 font-semibold' : 'hover:bg-pink-700'
    }`}
  >
    Mis datos
  </button>
</nav>


      {/* Contenido principal */}
      <main className="flex-1 p-10">
        {seccionActiva === 'perfil' && (
  <section>
    <h1 className="text-3xl font-bold text-pink-700 mb-6">Mi perfil</h1>
    <p className="text-pink-600 mb-8">Aquí puedes poner información del perfil del usuario, foto, saludo, etc.</p>
    
    <div className="flex gap-4">
      <button
        type="button"
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded transition"
      >
        Adoptar
      </button>

      <button
        type="button"
        className="bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-6 rounded transition"
      >
        Donar
      </button>
    </div>
  </section>
)}


        {seccionActiva === 'datos' && (
          <section>
            <h1 className="text-3xl font-bold text-pink-700 mb-6">Mis datos</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardar();
              }}
              className="max-w-xl bg-white p-6 rounded shadow space-y-5"
            >
              {(['nombre', 'email', 'telefono', 'direccion', 'ciudad', 'pais'] as (keyof UserData)[]).map((campo) => (
                <div key={campo}>
                  <label htmlFor={campo} className="block font-semibold mb-1 text-pink-700 capitalize">
                    {campo}
                  </label>
                  <input
                    id={campo}
                    name={campo}
                    type={campo === 'email' ? 'email' : 'text'}
                    disabled={!isEditando}
                    value={userData[campo]}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 ${
                      isEditando
                        ? 'border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400'
                        : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                    required={campo === 'nombre' || campo === 'email'}
                  />
                </div>
              ))}

              {!isEditando && (
                <button
                  type="button"
                  onClick={() => setIsEditando(true)}
                  className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
                >
                  Editar
                </button>
              )}

              {isEditando && (
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
                >
                  Guardar
                </button>
              )}
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
