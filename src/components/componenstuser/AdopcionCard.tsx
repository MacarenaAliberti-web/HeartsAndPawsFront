import Image from 'next/image';

interface AdopcionCardProps {
  adopcion: {
    id: string;
    estado: string;
    casoAdopcion: {
      caso: {
        titulo: string;
        descripcion: string;
        mascota: {
          nombre: string;
          imagenes: { url: string }[];
        };
        ong: {
          nombre: string;
        };
      };
    };
  };
}

const estadoColor = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  ACEPTADA: 'bg-green-100 text-green-800 border border-green-300',
  RECHAZADA: 'bg-red-100 text-red-800 border border-red-300',
};

export default function AdopcionCard({ adopcion }: AdopcionCardProps) {
  const { mascota, titulo, descripcion, ong } = adopcion.casoAdopcion.caso;
  const imagen = mascota.imagenes[0]?.url;

  return (
    <div className="relative bg-white border-2 border-pink-400 rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
      {imagen && (
        <div className="w-full md:w-40 h-40 relative">
          <Image
            src={imagen}
            alt={mascota.nombre}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-pink-700">{mascota.nombre}</h2>
          <span
  className={`text-sm px-4 py-1.5 rounded-full font-semibold capitalize ${
    estadoColor[adopcion.estado as keyof typeof estadoColor] || 'bg-gray-100 text-gray-800'
  }`}
>
  {adopcion.estado.toLowerCase()}
</span>

        </div>

        <p className="text-gray-700 font-semibold">{titulo}</p>
        <p className="text-gray-600 text-sm mb-2">{descripcion}</p>
        <p className="text-sm text-gray-500">ONG: {ong.nombre}</p>
      </div>
    </div>
  );
}
