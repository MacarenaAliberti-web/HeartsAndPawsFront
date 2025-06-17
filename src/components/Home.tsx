'use client';

import Image from 'next/image';
import { FaHome, FaExclamation, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start text-gray-800 bg-white w-full overflow-x-hidden">
      
      <div className="w-full relative h-[60vh] overflow-hidden flex items-center justify-center">
  <Image
    src="/pexels.jpg"
    alt="Niña con animales"
    fill
    className="object-cover"
    onLoadingComplete={() => console.log("Imagen cargada")}
    onError={(e) => console.log("Error al cargar la imagen", e)}
    priority
  />
  <div className="relative z-10 text-center px-4">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg"
    >
      Ayudemos juntos a quienes más lo necesitan
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-4 text-white text-lg md:text-xl drop-shadow-md"
    >
      Unimos fuerzas por los que no tienen voz
    </motion.p>
  </div>

 
</div>


      {/* Sección principal */}
      <section className="grid items-center w-full grid-cols-1 gap-8 px-4 py-16 max-w-7xl md:grid-cols-2">
        {/* Textos y botones con animación */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Unimos fuerzas <br /> por los que no tienen voz
          </h2>

          <div className="flex flex-col gap-3 mt-6">
            <button className="px-4 py-2 text-white transition bg-pink-400 rounded-full hover:bg-pink-500 w-fit">
              Casos
            </button>
            <Link href="/register/ong">
            <button className="px-4 py-2 text-pink-500 transition border-2 border-pink-400 rounded-full hover:bg-pink-100 w-fit">
              Registrá tu ONG
            </button>
           </Link>

         <Link href="/register/user">
            <button className="px-4 py-2 text-gray-700 transition bg-pink-200 rounded-full hover:bg-pink-300 w-fit">
              Registrate como usuario
            </button>
            </Link>
          </div>
        </motion.div>

        {/* Imagen mascotas con animación */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <Image
            src="/gato-y-amor.jpg" 
            alt="Perro y gato"
            width={300}
            height={300}
            className="rounded-xl"
          />
        </motion.div>
      </section>

      {/* Cómo funciona la red */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-5xl px-4 py-16 text-center"
      >
        <h2 className="mb-10 text-2xl font-semibold md:text-3xl">Cómo funciona la red</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <FaHome className="text-4xl text-pink-400" />
            <p>Registrá tu organización</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <FaExclamation className="text-4xl text-pink-400" />
            <p>Publicá casos de animales que necesiten ayuda</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <FaHandshake className="text-4xl text-pink-400" />
            <p>Colaborá con otras organizaciones</p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
