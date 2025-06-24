"use client";

import { useState, useEffect, JSX } from "react";
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
  FaHandsHelping,
} from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  //const supabase = createClient();
  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUserAndRoles = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("usuario desde navbar supabase: " + JSON.stringify(user));
      setUser(user);

      if (user) {

        //setUser(user);
        setRoles(["admin"]);
        // Asume que tienes una tabla `profiles` con roles asociados
        /*
        const { data: profile, error } = await supabase
          .from("users")
          .select("roles")
          .eq("id", user.id)  
          .single();

        if (profile?.roles && Array.isArray(profile.roles)) {
          setRoles(profile.roles);
        } else {
          setRoles([]);
        }

        if (error) console.error("Error loading profile:", error);*/
      }
        
    };

    getUserAndRoles();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserAndRoles();
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  type MenuLink = {
    label: string;
    href: string;
    icon: JSX.Element;
    onClick?: () => void | Promise<void>;
  };

  let menuLinks: MenuLink[] = [
    {
      label: "Te necesitan",
      href: "#casos",
      icon: <FaHeart className="text-pink-500" />,
    },
    { label: "Adoptar", href: "/adopcion", icon: <FaPaw /> },
    { label: "Registro", href: "/register", icon: <FaRegClipboard /> },
    { label: "Iniciar Sesión", href: "/login", icon: <FaSignInAlt /> },
  ];

  if (user) {
    menuLinks = [{ label: "Inicio", href: "/", icon: <FaHome /> }];

    if (roles.includes("ong")) {
      menuLinks.push(
        { label: "Mi Perfil", href: "/dashboard/ong", icon: <FaUserShield /> },
        {
          label: "Mis Casos",
          href: "/mis-casos",
          icon: <FaExclamationTriangle />,
        },
        { label: "Mensajes", href: "/chat", icon: <FaCommentDots /> }
      );
    }

    if (roles.includes("user")) {
      menuLinks.push(
        {
          label: "Mi Perfil",
          href: "/dashboard/usuario",
          icon: <FaUserShield />,
        },
        {
          label: "Te necesitan",
          href: "/donacion",
          icon: <FaHandsHelping className="text-pink-500" />,
        },
        { label: "Adoptar", href: "/adopcion", icon: <FaPaw /> },
        { label: "Favoritos", href: "/favoritos", icon: <FaHeart /> }
      );
    }

    if (roles.includes("admin")) {
      menuLinks.push({
        label: "Admin Perfil",
        href: "/dashboard/admin",
        icon: <FaUserShield />,
      });
    }

    menuLinks.push({
      label: "Cerrar sesión",
      href: "#",
      icon: <FaSignOutAlt />,
      onClick: async () => {
        await supabase.auth.signOut();
        window.location.reload();
      },
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

          <div className="hidden space-x-6 md:flex">
            {menuLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.onClick}
                className="flex items-center gap-1 text-gray-700 transition hover:text-pink-600"
              >
                <span className="text-pink-500">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

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
                onClick={() => {
                  setIsOpen(false);
                  link.onClick?.();
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
