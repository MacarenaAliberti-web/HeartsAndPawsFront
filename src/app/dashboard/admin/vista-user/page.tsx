

import { Usuario } from '@/types/user';
import Vistausuario from '../../../../components/componentsadmin/Vistausuario'

export default async function UserPage() {
 
 

  const usuario: Usuario[] = [];

  return (
    <Vistausuario usuario={usuario} />
  );
}