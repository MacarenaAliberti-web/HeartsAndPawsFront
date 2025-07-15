
import LoginONG from "@/components/forms/LoginONG"; ;

export default async function LoginPage() {
  // Si querés hacer una llamada del lado del server, podés hacer algo como esto:
  // const res = await fetch("https://tu-api.com/some-data", { cache: "no-store" });
  // const datos = await res.json();

  return (
  <div className="fixed inset-0 bg-pink-50 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center px-6">
        <div style={{ minWidth: "320px", maxWidth: "448px", width: "100%" }}>
      <LoginONG />
       </div>
      </div>
    </div>
  );
}
