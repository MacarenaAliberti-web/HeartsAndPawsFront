"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaPaw,
  FaBars,
  FaTimes,
  FaExclamationTriangle,
  FaRegClipboard,
  FaSignInAlt,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaCommentDots,
  FaHeart,
  FaHandsHelping,
  FaUser,
} from "react-icons/fa";

import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // 👈 Nuevo estado

  const { ong, logout: logoutOng } = useOngAuth();
  const { usuario, logout: logoutUsuario } = useUsuarioAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true); // 👈 Activamos después de montar en cliente

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🛑 Importante: prevenir render en SSR
  if (!hasMounted) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoutOng = () => {
    logoutOng();
    router.push("/");
  };

  const handleLogoutUsuario = () => {
    logoutUsuario();
    router.push("/");
  };

  let menuLinks: {
    label: string;
    href: string;
    icon: JSX.Element;
    onClick?: () => void;
  }[] = [];

  if (ong) {
    menuLinks = [
      { label: "Inicio", href: "/", icon: <FaHome /> },
      { label: "Mi Perfil", href: "/dashboard/ong", icon: <FaUserShield /> },
      { label: "Publicar", href: "/dashboard/ong/nueva-mascota", icon: <FaExclamationTriangle /> },
      { label: "Mensajes", href: "/chat", icon: <FaCommentDots /> },
      {
        label: "Cerrar sesión",
        href: "#",
        icon: <FaSignOutAlt />,
        onClick: handleLogoutOng,
      },
    ];
  } else if (usuario) {
    menuLinks = [
     {
    label: "Perfil",
    href: "/dashboard/usuario",
    icon: <FaUser className="text-pink-500" />,
  },

      { label: "Te necesitan", href: "/donacion", icon: <FaHandsHelping className="text-pink-500" /> },
      { label: "Adoptar", href: "/adoptar/adopcion", icon: <FaPaw/> },
      { label: "Favoritos", href: "/favoritos", icon: <FaHeart /> },
      {
        label: "Cerrar sesión",
        href: "#",
        icon: <FaSignOutAlt />,
        onClick: handleLogoutUsuario,
      },
    ];
  } else {
    menuLinks = [
      { label: "Te necesitan", href: "/donacion", icon: <FaHandsHelping className="text-pink-500" /> },
      { label: "Adoptar", href: "/adoptar/adopcion", icon: <FaPaw/> },
      { label: "Registro", href: "/register", icon: <FaRegClipboard /> },
      { label: "Iniciar Sesión", href: "/login", icon: <FaSignInAlt /> },
    ];
  }

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 w-full z-50 transition-all ${
        scrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-white/90"
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-3xl font-semibold text-pink-600"
          >
            <FaPaw className="text-4xl" />
            <span>Hearts&Paws</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden space-x-6 md:flex">
            {menuLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={
                  link.onClick
                    ? (e) => {
                        e.preventDefault();
                        link.onClick?.();
                      }
                    : undefined
                }
                className="flex items-center gap-1 text-xl font-semibold text-gray-800 transition hover:text-pink-600"
              >
                <span className="text-2xl text-pink-500">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
              {isOpen ? <FaTimes className="text-4xl" /> : <FaBars className="text-4xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="px-4 py-4 space-y-2 bg-white shadow-md md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                    setIsOpen(false);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className="flex items-center gap-2 text-gray-700 hover:text-pink-600"
              >
                <span className="text-pink-500">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;

