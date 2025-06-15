"use client"
import { useAppContext } from '@/context/AppContext';
import React, { useState } from 'react'
import ProfileOng from './ProfileOng';
import NewCaseOng from './NewCaseOng';
import AdoptionsOng from './AdoptionsOng';
import PublishedOng from './PublishedOng';
import DonationsOng from './DonationsOng';


const MyAccount = () => {
  const { userData, setUserData, logout } = useAppContext();

  const [selectedView, setSelectedView] = useState<
    | "profil"
    | "donations"
    | "newCase"
    | "myCases"
    | "adoptions"
  >("profil");

const user = userData?.user;

  return (
    <div className="flex min-h-screen -mt-16">
      <aside className="w-64 bg-pink-600 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Mi cuenta</h2>

        {[
          { label: "Mi Perfil", view: "profil" },
          { label: "Historial de Donaciones", view: "donations" },
          { label: "Publicar Nuevo Caso", view: "newCase" },
          { label: "Mis Casos Publicados", view: "myCases" },
          { label: "Solicitudes de Adopción", view: "adoptions" },
        ].map((item) => (
          <button
            key={item.view}
            className={`block w-full text-left py-2 px-3 rounded hover:bg-pink-700 ${
              selectedView === item.view ? "bg-pink-700" : ""
            }`}
            onClick={() => setSelectedView(item.view as any)}
          >
            {item.label}
          </button>
        ))}

     
      </aside>

      <main className="flex-1 p-10 bg-gray-300">
        {selectedView === "profil" && <ProfileOng />}
        {selectedView === "donations" && <DonationsOng />}
        {selectedView === "newCase" && <NewCaseOng />}
        {selectedView === "myCases" && <PublishedOng />}
        {selectedView === "adoptions" && <AdoptionsOng />}
      </main>
    </div>
  );
};

export default MyAccount
