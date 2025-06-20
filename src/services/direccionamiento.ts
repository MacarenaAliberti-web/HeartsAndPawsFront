 export async function getMyUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('Response status:', res.status);
        return res.json();
        
        } catch (error) {
        console.error('Error al obtener usuario:', error);
            
      }

      
    }