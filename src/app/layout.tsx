import "./globals.css";
import { Toaster } from "react-hot-toast";

import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { OngAuthProvider } from "@/context/OngAuthContext";
import { UsuarioAuthProvider } from "@/context/UsuarioAuthContext"; // 👈 Nuevo contexto

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hearts & Paws ONG",
  description: "Panel de gestión para organizaciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <UsuarioAuthProvider> {/* ⬅️ Usuario común */}
          <OngAuthProvider>    {/* ⬅️ ONG */}
            <Navbar />
            <main className="pt-16">{children}</main>
            <Toaster /> {/* ⬅️ Notificaciones */}
          </OngAuthProvider>
        </UsuarioAuthProvider>
      </body>
    </html>
  );
}
