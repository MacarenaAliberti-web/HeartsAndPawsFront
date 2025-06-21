export async function logoutService() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/cerrarSesion`, {
      method: 'POST',          
      credentials: 'include',  // enviar cookies de sesión
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}
