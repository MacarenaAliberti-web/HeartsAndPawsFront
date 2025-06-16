import { OngAuthProvider } from '@/context/OngAuthContext'; // ✅ Tu contexto de autenticación ONG
import { Toaster } from "react-hot-toast"; // <-- agrego import

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
        <OngAuthProvider> {/* ✅ Tu contexto de autenticación personalizado */}
          <Navbar />
          <main className="pt-16">{children}</main>
          <Toaster /> {/* <-- aquí agrego el Toaster */}
        </OngAuthProvider>
      </body>
    </html>
  );
}
