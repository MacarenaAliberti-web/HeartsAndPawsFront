import DonacionExitosaPage from "@/components/donacion/DonacionExito";
import { Suspense } from "react";

export default function Page() {




  return(

    <>
     <Suspense fallback={<div>Loading...</div>}>
     <DonacionExitosaPage />;
    </Suspense>
    </>
  )
  
  
  
 
}