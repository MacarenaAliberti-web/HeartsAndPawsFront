

export const loginUserService = async (email: string, contrasena: string) => {
  console.log('Service: Usuario: ' + email);
  console.log('Service: Passwd: ' + contrasena);
  
 const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/ingreso`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, contrasena }),
    });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login fallido');
  }

  return data;
};


export async function authMe(){
      try {
      const res =  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',        
      });
        return res;
      } catch (error) {
      console.error(`Error al ontener usuario`, error);
      
    }  
}
