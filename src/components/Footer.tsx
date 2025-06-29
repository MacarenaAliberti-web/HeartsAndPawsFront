// components/Footer.tsx
import { FaPaw, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

 export const Footer = () => {
  return (
    <footer className="py-8 mt-12 text-gray-800 bg-pink-100">
      <div className="grid grid-cols-1 gap-8 px-4 mx-auto max-w-7xl md:grid-cols-3">
        {/* Logo + Descripción */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-2xl font-bold text-pink-600">
            <FaPaw />
            <span>Hearts&Paws</span>
          </div>
          <p className="text-sm">
            Rescatamos, cuidamos y conectamos animales con hogares llenos de amor. ¡Gracias por apoyar nuestra misión! 💕
          </p>
        </div>

       {/* Enlaces rápidos */}
<div>
  <h4 className="mb-2 font-semibold">Enlaces</h4>
  <ul className="space-y-1 text-sm">
    <li>
      <a href="/adoptar/adopcion" className="hover:text-pink-600">
        Adopciones
      </a>
    </li>
    <li>
      <a href="/donacion" className="hover:text-pink-600">
        Donaciones
      </a>
    </li>
    <li>
      <Link href="/register" className="hover:text-pink-600">
        Registro
      </Link>
    </li>
    <li>
      <a href="/login" className="hover:text-pink-600">Iniciar sesión</a>
    </li>
  </ul>
</div>


        {/* Redes sociales */}
        <div>
          <h4 className="mb-2 font-semibold">Seguinos</h4>
          <div className="flex gap-4 text-xl text-pink-600">
            <a href="#" aria-label="Facebook" className="hover:text-pink-800"><FaFacebook /></a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-800"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="hover:text-pink-800"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-8 text-sm text-center text-gray-500 border-t border-pink-300">
        © {new Date().getFullYear()} Hearts&Paws. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
