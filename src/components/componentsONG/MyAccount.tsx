"use client";

import { useOngAuth } from "@/context/OngAuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileOng from "./ProfileOng";
import AdoptionsOng from "./AdoptionsOng";
import DonationsOng from "./DonationsOng";
import CasesOng from "./CasesOng";

type ViewType = "profil" | "donations" | "adoptions" | "cases";

const MyAccount = () => {
  const { ong, loading } = useOngAuth();
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<ViewType>("profil");

  // Redirige si no hay sesión
  useEffect(() => {
    if (!loading && !ong) {
      router.push("/login");
    }
  }, [loading, ong, router]);

  // Desactiva el scroll global SOLO en esta página
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (loading || !ong) return null;

  return (
    <div className="flex h-screen  overflow-hidden">
      <aside className="w-64 p-6 space-y-4 text-white bg-pink-600">
        <h2 className="mb-6 text-2xl font-bold">Mi cuenta</h2>

        {[
          { label: "Mi Perfil", view: "profil" },
          { label: "Historial de Donaciones", view: "donations" },
          { label: "Solicitudes de Adopción", view: "adoptions" },
          { label: "Mis Casos", view: "cases" },
        ].map((item) => (
          <button
            key={item.view}
            className={`block w-full text-left py-2 px-3 rounded hover:bg-pink-700 ${
              selectedView === item.view ? "bg-pink-700" : ""
            }`}
            onClick={() => setSelectedView(item.view as ViewType)}
          >
            {item.label}
          </button>
        ))}
        <button
          className="block w-full text-left py-2 px-3 rounded hover:bg-pink-700"
          onClick={() => router.push("/chat")}
        >
          Mensajes
        </button>
      </aside>

      <main className="flex-1 p-10 bg-pink-50 overflow-y-auto transition-all duration-300 ease-in-out">
        {selectedView === "profil" && <ProfileOng />}
        {selectedView === "donations" && <DonationsOng />}
        {selectedView === "adoptions" && <AdoptionsOng />}
        {selectedView === "cases" && <CasesOng />}
      </main>
    </div>
  );
};

export default MyAccount;
