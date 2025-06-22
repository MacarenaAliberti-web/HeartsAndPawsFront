"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOngAuth } from "@/context/OngAuthContext";

import NewCaseOng from "./NewCaseOng"; // ✅ importar el otro formulario
import { createPet, petImages } from "@/services/pet";

interface TipoMascota {
  id: string;
  nombre: string;
}

interface IMascotaFormData {
  nombre: string;
  edad: number;
  descripcion: string;
  tipoId: string;
  imagenes: FileList;
}

const NewPet = () => {
  const { ong } = useOngAuth();
  const [tipos, setTipos] = useState<TipoMascota[]>([]);
  const [mostrarFormCaso, setMostrarFormCaso] = useState(false); // ✅ estado nuevo

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IMascotaFormData>();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const res = await fetch("https://backend-hearts-paws-dev.onrender.com/mascotas/tipo");
        const data = await res.json();
        setTipos(data);
      } catch (error) {
        console.error("Error al cargar tipos de mascota", error);
      }
    };

    fetchTipos();
  }, []);

  const onSubmit = async (data: IMascotaFormData) => {
    if (!ong) return alert("No se encontró la ONG");

    try {
      const nuevaMascota = await createPet({
        nombre: data.nombre,
        edad: Number(data.edad),
        descripcion: data.descripcion,
        tipoId: data.tipoId,
        organizacionId: ong.id,
      });

      if (data.imagenes.length > 0) {
        await petImages(nuevaMascota.id, data.imagenes);
      }

      alert("Mascota registrada con éxito");
      reset();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al registrar la mascota");
    }
  };

  // ✅ si se pidió crear publicación, mostramos el form de caso
  if (mostrarFormCaso) return <NewCaseOng />;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">Registrar Nueva Mascota</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ...campos como los tenías... */}

        <div>
          <label className="block mb-2 font-semibold">Nombre</label>
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
          />
          {errors.nombre && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Edad</label>
          <input
            type="number"
            {...register("edad", { required: true, min: 0 })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
          />
          {errors.edad && <p className="text-red-500 text-sm">Ingresa una edad válida.</p>}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Descripción</label>
          <textarea
            {...register("descripcion", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
            rows={4}
          />
          {errors.descripcion && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Tipo</label>
          <select
            {...register("tipoId", { required: true })}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Selecciona un tipo</option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          {errors.tipoId && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
        </div>

        <div>
          <label className="block mb-2 font-semibold">Imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            {...register("imagenes", { required: true })}
            className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
          />
          {errors.imagenes && <p className="text-red-500 text-sm">Debes subir al menos una imagen.</p>}
        </div>

        {/* Botón para registrar mascota */}
        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition duration-300"
        >
          Registrar Mascota
        </button>
      </form>

      {/* ✅ Botón adicional para crear publicación */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-2">¿Ya registraste una mascota?</p>
        <button
          onClick={() => setMostrarFormCaso(true)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
        >
          Crear publicación
        </button>
      </div>
    </div>
  );
};

export default NewPet;












// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useOngAuth } from "@/context/OngAuthContext";
// import { createPet, petImages } from "@/services/pet";


// interface TipoMascota {
//   id: string;
//   nombre: string;
// }

// interface IMascotaFormData {
//   nombre: string;
//   edad: number;
//   descripcion: string;
//   tipoId: string;
//   imagenes: FileList;
// }

// const NewPet = () => {
//   const { ong } = useOngAuth();

//   const [tipos, setTipos] = useState<TipoMascota[]>([]);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<IMascotaFormData>();

//   useEffect(() => {
//     const fetchTipos = async () => {
//       try {
//         const res = await fetch("https://backend-hearts-paws-dev.onrender.com/mascotas/tipo");
//         const data = await res.json();
//         setTipos(data);
//       } catch (error) {
//         console.error("Error al cargar tipos de mascota", error);
//       }
//     };

//     fetchTipos();
//   }, []);

//   const onSubmit = async (data: IMascotaFormData) => {
//     if (!ong) return alert("No se encontró la ONG");

//     try {
//       const nuevaMascota = await createPet({
//         nombre: data.nombre,
//         edad: Number(data.edad),
//         descripcion: data.descripcion,
//         tipoId: data.tipoId,
//         organizacionId: ong.id,
//       });

//       if (data.imagenes.length > 0) {
//         await petImages(nuevaMascota.id, data.imagenes);
//       }

//       alert("Mascota registrada con éxito");
//       reset();
//     } catch (error) {
//       console.error(error);
//       alert("Hubo un error al registrar la mascota");
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-800">
//       <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">Registrar Nueva Mascota</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block mb-2 font-semibold">Nombre</label>
//           <input
//             type="text"
//             {...register("nombre", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.nombre && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Edad</label>
//           <input
//             type="number"
//             {...register("edad", { required: true, min: 0 })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.edad && <p className="text-red-500 text-sm">Ingresa una edad válida.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Descripción</label>
//           <textarea
//             {...register("descripcion", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//             rows={4}
//           />
//           {errors.descripcion && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Tipo</label>
//           <select
//             {...register("tipoId", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           >
//             <option value="">Selecciona un tipo</option>
//             {tipos.map((tipo) => (
//               <option key={tipo.id} value={tipo.id}>
//                 {tipo.nombre}
//               </option>
//             ))}
//           </select>
//           {errors.tipoId && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Imágenes</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             {...register("imagenes", { required: true })}
//             className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.imagenes && <p className="text-red-500 text-sm">Debes subir al menos una imagen.</p>}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition duration-300"
//         >
//           Registrar Mascota
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewPet;





// "use client";
// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useOngAuth } from "@/context/OngAuthContext";

// interface TipoMascota {
//   id: string;
//   nombre: string;
// }

// interface IMascotaFormData {
//   nombre: string;
//   edad: number;
//   descripcion: string;
//   tipoId: string;
//   imagenes: FileList;
// }

// const NewPet = () => {
//   const { ong } = useOngAuth();

//   if (!ong) {
//     return <p className="text-center text-gray-500">Cargando datos de la organización...</p>;
//   }

//   const ongId = ong.id; // ✅ TypeScript ya no se queja

//   const [tipos, setTipos] = useState<TipoMascota[]>([]);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<IMascotaFormData>();

//   useEffect(() => {
//     const fetchTipos = async () => {
//       try {
//         const res = await fetch("https://backend-hearts-paws-dev.onrender.com/mascotas/tipo");
//         const data = await res.json();
//         setTipos(data);
//       } catch (error) {
//         console.error("Error al cargar tipos de mascota", error);
//       }
//     };

//     fetchTipos();
//   }, []);

// const onSubmit = async (data: IMascotaFormData) => {
//   try {
//     const { nombre, edad, descripcion, tipoId, imagenes } = data;

//   const body = {
//   nombre,
//   edad: Number(edad), // 👈 forzamos que sea número
//   descripcion,
//   tipoId,
//   organizacionId: ongId,
// };

//     console.log("🟨 Enviando body:", body); // 👈 Agregá esto

//     console.log("🔍 Body a enviar:", {
//   nombre,
//   edad,
//   descripcion,
//   tipoId,
//   organizacionId: ongId,
// });


//     const resMascota = await fetch("https://backend-hearts-paws-dev.onrender.com/mascotas", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     if (!resMascota.ok) throw new Error("Error al crear mascota");
//     const nuevaMascota = await resMascota.json();
//     const mascotaId = nuevaMascota.id;
    
//     // subir imágenes...


//       if (imagenes.length > 0) {
//         const formData = new FormData();
//         Array.from(imagenes).forEach((img) => formData.append("imagenes", img));

//         const resImagen = await fetch(
//           `https://backend-hearts-paws-dev.onrender.com/mascotas/${mascotaId}/imagenes`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         if (!resImagen.ok) throw new Error("Error al subir imágenes");
//       }

//       alert("Mascota registrada con éxito");
//       reset();
//     } catch (error) {
//       console.error(error);
//       alert("Hubo un error al registrar la mascota");
//     }
//   };


//   return (
//     <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-gray-800">
//       <h1 className="text-3xl font-bold mb-8 text-center text-pink-600">Registrar Nueva Mascota</h1>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label className="block mb-2 font-semibold">Nombre</label>
//           <input
//             type="text"
//             {...register("nombre", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.nombre && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Edad</label>
//           <input
//             type="number"
//             {...register("edad", { required: true, min: 0 })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.edad && <p className="text-red-500 text-sm">Ingresa una edad válida.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Descripción</label>
//           <textarea
//             {...register("descripcion", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//             rows={4}
//           />
//           {errors.descripcion && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Tipo</label>
//           <select
//             {...register("tipoId", { required: true })}
//             className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           >
//             <option value="">Selecciona un tipo</option>
//             {tipos.map((tipo) => (
//               <option key={tipo.id} value={tipo.id}>
//                 {tipo.nombre}
//               </option>
//             ))}
//           </select>
//           {errors.tipoId && <p className="text-red-500 text-sm">Este campo es obligatorio.</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-semibold">Imágenes</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             {...register("imagenes", { required: true })}
//             className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500"
//           />
//           {errors.imagenes && <p className="text-red-500 text-sm">Debes subir al menos una imagen.</p>}
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition duration-300"
//         >
//           Registrar Mascota
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewPet;
