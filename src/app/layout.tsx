import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import NavbarWrapper from "@/components/NavbarWrapper";
import { UsuarioAuthProvider } from "@/context/UsuarioAuthContext";
import { OngAuthProvider } from "@/context/OngAuthContext";
import { AuthProvider } from "@/components/SupabaseProvider";
import { Toaster } from "react-hot-toast";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hearts and Paws",
  description: "Conectando personas y ONGs para ayudar a animales necesitados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <UsuarioAuthProvider>
            <OngAuthProvider>
              <NavbarWrapper />              
              <main className="pt-16">{children}</main>
              <Toaster />
            </OngAuthProvider>
          </UsuarioAuthProvider>
         </AuthProvider>
      </body>
    </html>
  );
}
