

import FormularioAdopcionPage from '@/components/adopcion/formulario-adopcion/FormularioPage';
import { Suspense } from 'react';


export default function FormularioAdopcion() {



  return (
<>
<Suspense fallback={<div>Cargando...</div>}>
  <FormularioAdopcionPage />
</Suspense>
</>


  )
  
  

}
