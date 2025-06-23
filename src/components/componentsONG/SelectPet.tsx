"use client";
import React, { useEffect, useState } from "react";
import { useOngAuth } from "@/context/OngAuthContext";
import { fetchPetsByOngId } from "@/services/petsService";


interface Pet {
  id: string;
  nombre: string;
}

interface Props {
  register: any;
  errors: any;
}

const SelectPet = ({ register, errors }: Props) => {
  const { ong } = useOngAuth();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (!ong) return;

    fetchPetsByOngId(ong.id)
      .then(setPets)
      .catch((err) => console.error("Error fetching pets", err));
  }, [ong]);

  return (
    <div>
      <label className="block mb-2 font-semibold">Mascota</label>
      <select
        {...register("petId", { required: true })}
        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="">Selecciona una mascota</option>
        {pets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
      {errors.petId && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
    </div>
  );
};

export default SelectPet;





// "use client";
// import React, { useEffect, useState } from "react";
// import { useOngAuth } from "@/context/OngAuthContext";

// interface Pet {
//   id: string;
//   nombre: string; // puedes cambiar a "name" si en backend está así
// }

// interface Props {
//   register: any;
//   errors: any;
// }

// const SelectPet = ({ register, errors }: Props) => {
//   const { ong } = useOngAuth();
//   const [pets, setPets] = useState<Pet[]>([]);

//   useEffect(() => {
//     if (!ong) return;
//     fetch(`https://backend-hearts-paws-dev.onrender.com/mascotas/ong/${ong.id}`)
//       .then(res => res.json())
//       .then(data => setPets(data))
//       .catch(err => console.error("Error fetching pets", err));
//   }, [ong]);

//   return (
//     <div>
//       <label className="block mb-2 font-semibold">Pet</label>
//       <select
//         {...register("petId", { required: true })}
//         className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
//       >
//         <option value="">Select a pet</option>
//         {pets.map(p => (
//           <option key={p.id} value={p.id}>{p.nombre}</option>
//         ))}
//       </select>
//       {errors.petId && <p className="text-red-500 text-sm mt-1">This field is required.</p>}
//     </div>
//   );
// };

// export default SelectPet;
