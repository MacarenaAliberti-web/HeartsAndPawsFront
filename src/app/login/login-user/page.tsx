import LoginUsuario from "@/components/forms/LoginUsuario";

export default function LoginUsuarioPage() {
  return (
    <div className="fixed inset-0 bg-pink-50 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center px-6">
        <div style={{ minWidth: "320px", maxWidth: "448px", width: "100%" }}>
          <LoginUsuario />
        </div>
      </div>
    </div>
  );
}