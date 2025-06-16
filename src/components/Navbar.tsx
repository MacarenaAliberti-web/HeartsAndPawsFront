"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaPaw,
  FaBars,
  FaTimes,
  FaExclamationTriangle,
  FaRegClipboard,
  FaSignInAlt,
  FaHeart,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaCommentDots,
} from "react-icons/fa";
import { useOngAuth } from "../context/OngAuthContext"; // ⬅️ Asegurate de que el path sea correcto

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { ong, logout } = useOngAuth(); // ⬅️ Tomamos el usuario y logout desde el context

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔍 Armado del menú
  let menuLinks = [
    { label: "Casos", href: "#casos", icon: <FaExclamationTriangle /> },
    { label: "Registro", href: "/register", icon: <FaRegClipboard /> },
    { label: "Iniciar Sesión", href: "/login-ong", icon: <FaSignInAlt /> },
  ];

  if (ong) {
    menuLinks = [
      { label: "Inicio", href: "/", icon: <FaHome /> },
    ];

    if (ong.role === "ong") {
      menuLinks.push(
        { label: "Mi Perfil", href: "/dashboard/ong", icon: <FaUserShield /> },
        { label: "Mis Casos", href: "/mis-casos", icon: <FaExclamationTriangle /> },
        { label: "Mensajes", href: "/chat", icon: <FaCommentDots /> }
      );
    }

    // 🎯 Logout manejado por función
    menuLinks.push({
      label: "Cerrar sesión",
      href: "#",
      icon: <FaSignOutAlt />,
      onClick: logout,
    });
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
            className="flex items-center gap-2 text-xl font-bold text-pink-600"
          >
            <FaPaw className="text-2xl" />
            <span>Hearts&Paws</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden space-x-6 md:flex">
            {menuLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick?.(); } : undefined}
                className="flex items-center gap-1 text-gray-700 transition hover:text-pink-600"
              >
                <span className="text-pink-500">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
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