"use client";

export default function LoginPage() {
  const handleLoginWithGoogle = () => {
    //indow.location.href = "/api/auth/login?connection=google-oauth2";
    window.location.href = '/api/auth/login?connection=google-oauth2';
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Iniciar sesión</h1>
      <button
        onClick={handleLoginWithGoogle}
        className="px-4 py-2 text-white bg-pink-600 rounded hover:bg-pink-700"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
