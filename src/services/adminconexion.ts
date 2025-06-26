
export async function getMyadmin() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizaciones`, {
            method: 'GET',
            credentials: 'include',
        });
        console.log('Organizaciones: ' + JSON.stringify(res));

        return res;
    } catch (error) {
        console.error('Error cargando solicitudes:', error);
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
        console.error(`Error al ${decision === 'APROBADA' ? 'aceptar' : 'RECHAZADA'} solicitud`, error);

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
        console.error('Error cargando solicitudes:', error);
    }
};
