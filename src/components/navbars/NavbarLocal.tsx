"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding, FaChevronDown } from "react-icons/fa";
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
  FaHandsHelping,
  FaUser,
} from "react-icons/fa";

import { useOngAuth } from "@/context/OngAuthContext";
import { useUsuarioAuth } from "@/context/UsuarioAuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showHistorialDropdown, setShowHistorialDropdown] = useState(false);

  const { ong, logout: logoutOng } = useOngAuth();
  const { usuario, logout: logoutUsuario } = useUsuarioAuth();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hasMounted) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogoutOng = () => {
    logoutOng();
    router.refresh(); 
    router.push("/");
  };

  const handleLogoutUsuario = () => {
    logoutUsuario();
    router.refresh(); 
    router.push("/");
  };

  type MenuLink = {
    label: string;
    href: string;
    icon: JSX.Element;
    onClick?: () => void;
    subItems?: { label: string; href: string }[];
  };

  let menuLinks: MenuLink[] = [];

  if (ong) {
    menuLinks = [
      { label: "Inicio", href: "/", icon: <FaHome /> },
      { label: "Mi Perfil", href: "/dashboard/ong", icon: <FaUserShield /> },
      {
        label: "Publicar",
        href: "/dashboard/ong/nueva-mascota",
        icon: <FaExclamationTriangle />,
      },

      { label: "Mensajes", href: "/chat", icon: <FaCommentDots /> },
      {
        label: "Cerrar sesión",
        href: "#",
        icon: <FaSignOutAlt />,
        onClick: handleLogoutOng,
      },
    ];
  } else if (usuario) {
    if (usuario.rol === "ADMIN") {
      menuLinks = [
        {
          label: "Perfil Admin",
          href: "/dashboard/admin",
          icon: <FaUserShield />,
        },
        {
          label: " Usuarios",
          href: "/dashboard/admin/vista-user",
          icon: <FaUser />,
        },
        {
         label: "Organizaciones",
         href: "#",
         icon: <FaBuilding />,
        },
        {
          label: "Otros",
          href: "#",
          icon: <FaRegClipboard />,
          onClick: () => setShowHistorialDropdown((prev) => !prev),
          subItems: [
            { label: "Aprobadas", href: "/admin/historial/aprobadas" },
            { label: "Rechazadas", href: "/admin/historial/rechazadas" },
            { label: "Mascotas", href: "/admin/historial/rechazadas" },
            { label: "Solicitudes", href: "/admin/historial/rechazadas" },
            { label: "Adopciones", href: "/admin/historial/rechazadas" },
            { label: "Donaciones", href: "/admin/historial/rechazadas" },
          ],
        },
        {
          label: "Cerrar sesión",
          href: "#",
          icon: <FaSignOutAlt />,
          onClick: handleLogoutUsuario,
        },
      ];
    } else {
      menuLinks = [
        {
          label: "Perfil",
          href: "/dashboard/usuario",
          icon: <FaUser className="text-pink-500" />,
        },
        {
          label: "Te necesitan",
          href: "/donacion",
          icon: <FaHandsHelping className="text-pink-500" />,
        },
        { label: "Adoptar", href: "/adoptar/adopcion", icon: <FaPaw /> },
        {
          label: "Cerrar sesión",
          href: "/login",
          icon: <FaSignOutAlt />,
          onClick: handleLogoutUsuario,
        },
      ];
    }
  } else {
    menuLinks = [
      {
        label: "Te necesitan",
        href: "/donacion",
        icon: <FaHandsHelping className="text-pink-500" />,
      },
      { label: "Adoptar", href: "/adoptar/adopcion", icon: <FaPaw /> },
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
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-4xl font-semibold text-pink-600 whitespace-nowrap"
          >
            <FaPaw className="text-5xl" />
            <span>Hearts&Paws</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {menuLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.onClick ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      link.onClick?.();
                    }}
                    className="flex items-center gap-1 text-lg font-medium text-gray-800 transition hover:text-pink-600 whitespace-nowrap"
                  >
                    <span className="text-2xl text-pink-500">{link.icon}</span>
                    {link.label}
                    {link.subItems && (
                      <FaChevronDown className="ml-1 text-sm" />
                    )}
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-lg font-medium text-gray-800 transition hover:text-pink-600 whitespace-nowrap"
                  >
                    <span className="text-2xl text-pink-500">{link.icon}</span>
                    {link.label}
                  </Link>
                )}

                {/* Dropdown solo si hay subItems y está abierto */}
                {link.subItems && showHistorialDropdown && (
                  <div className="absolute left-0 z-10 mt-2 w-48 bg-white rounded shadow-lg">
                    {link.subItems.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-pink-100"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="text-4xl" />
              ) : (
                <FaBars className="text-4xl" />
              )}
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
              <div key={link.label}>
                <a
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

                {/* Subitems (solo para historial ONG en mobile) */}
                {link.subItems && (
                  <div className="ml-6 mt-1 space-y-1">
                    {link.subItems.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-gray-600 hover:text-pink-600"
                      >
                        - {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
