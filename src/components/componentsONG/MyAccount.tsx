"use client";

import { useOngAuth } from "@/context/OngAuthContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileOng from "./ProfileOng";
import NewCaseOng from "./NewCaseOng";
import AdoptionsOng from "./AdoptionsOng";
import DonationsOng from "./DonationsOng";
import CasesOng from "./CasesOng";

type ViewType = "profil" | "donations" | "adoptions" | "cases";


const MyAccount = () => {
  const { ong, loading } = useOngAuth();
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<ViewType>("profil");

  useEffect(() => {
    if (!loading && !ong) {
      router.push("/login"); // Cambia por la ruta de login de ONG
    }
  }, [loading, ong, router]);

  if (loading) return null; // O algún loader mientras carga la cookie

  if (!ong) return null; // Evita renderizar si no está logueada

  return (
    <div className="flex min-h-screen -mt-16">
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
      </aside>

      <main className="flex-1 p-10 bg-pink-50">
        {selectedView === "profil" && <ProfileOng />}
        {selectedView === "donations" && <DonationsOng />}
        {selectedView === "adoptions" && <AdoptionsOng />}
        {selectedView === "cases" && <CasesOng />}

      </main>
    </div>
  );
};

export default MyAccount;