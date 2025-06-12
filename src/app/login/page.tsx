// src/app/login/page.tsx
import LoginForm from "../../components/Login";

export default async function LoginPage() {
  // Si querés hacer una llamada del lado del server, podés hacer algo como esto:
  // const res = await fetch("https://tu-api.com/some-data", { cache: "no-store" });
  // const datos = await res.json();

  return (
    <div className="p-4">
      <LoginForm />
    </div>
  );
}
