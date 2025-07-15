
export async function getTotalOrganizaciones() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('Organizaciones: ' + JSON.stringify(res));

        return res;
    } catch (error) {
        console.log('Error cargando solicitudes:', error);
    }
};

export async function Patchsolicitud(id: string, decision: 'APROBADA' | 'RECHAZADA') {

    try {
        return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/${id}/estado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ estado: decision }),
        });

    } catch (error) {
        console.log(`Error al ${decision === 'APROBADA' ? 'aceptar' : 'RECHAZADA'} solicitud`, error);

    }
}

export async function getVerificacion(id: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/${id}/archivo-verificacion`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log(`FETCH:  ${process.env.NEXT_PUBLIC_API_URL}/organizaciones/${id}/archivo-verificacion`);
        console.log('Organizaciones: ' + (res));

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        return res;
    } catch (error) {
        console.log('Error cargando solicitudes:', error);
    }
};
 

export async function getTodosUser(filtros: { nombre?: string; email?: string } = {}) {
  try {
    const queryParams = new URLSearchParams();

    if (filtros.nombre) queryParams.append("nombre", filtros.nombre);
    if (filtros.email) queryParams.append("email", filtros.email);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/usuarios?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    return res;
  } catch (error) {
    console.log("Error cargando Usuarios:", error);
  }
}

export async function getTotalOrganizacionesAprobadas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/aprobadas/total`, {
            method: 'GET',
            credentials: 'include',
        });
  //if (!res.ok) throw new Error('Error al obtener organizaciones aprobadas')
  const data = await res.json()
  return data.total
}

export async function getTotalMascotas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas/total`, {
            method: 'GET',
            credentials: 'include',
        });
  //if (!res.ok) throw new Error('Error al obtener total de mascotas')
  const data = await res.json()
  return data.total
}

export async function getTotalDonaciones() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donacion/total`,{
            method: 'GET',
            credentials: 'include',
        });
     

  if (!res.ok) throw new Error('Error al obtener total de donaciones')
  const data = await res.json()
  return  Math.round(data.total * 100) / 100;

  
}

export async function getTotalAdopcionesAceptadas(): Promise<number> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar/aceptadas/total`,{
            method: 'GET',
            credentials: 'include',
        });
  console.log('Status:', res.status)
  if (!res.ok) {
    const errorText = await res.text()
    console.log('Respuesta no OK:', errorText) 
    throw new Error('Error al obtener adopciones aceptadas')
  }

  const data = await res.json()
  console.log('Data recibida:', data) 

  return data.total 
}

// services/adminconexion.ts
export async function getTodosOng(params: { nombre?: string; plan?: string } = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.nombre) queryParams.append("nombre", params.nombre);
    if (params.plan) queryParams.append("plan", params.plan.toUpperCase());

    const url = `${process.env.NEXT_PUBLIC_API_URL}/organizaciones/aprobadas?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    return res;
  } catch (error) {
    console.log("Error cargando Organizaciones:", error);
  }
}


export async function getTotalOrganizacionesRechazadas() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones/rechazadas`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('Organizaciones: ' + JSON.stringify(res));

        return res;
    } catch (error) {
        console.error('Error cargando Organizaciones Rechazadas:', error);
    }
};


  export async function fetchMascotasObtenidas() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/mascotas`, {
          method: "GET",
          credentials: "include",
        });
       // if (!res.ok) throw new Error("No se pudo obtener la lista de mascotas.");
        return res;
        
      
      } catch (err) {
        console.log(err);
   
    }
  }

  export async function getTodasAdopciones() {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitud-adoptar`, {
    method: "GET",
    credentials: "include",
  });
}


 export async function getTodasDonaciones() {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donacion`, {
    method: "GET",
    credentials: "include",
  });
}
