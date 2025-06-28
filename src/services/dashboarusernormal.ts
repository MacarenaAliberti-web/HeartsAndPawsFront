 
 
//export async function ProfileUser(files: { file: { filepath: string; originalFilename: string }[] }) {
//    const file = files.file[0];
//    const formData = new FormData();
//    formData.append('file', file.filepath as unknown as File, file.originalFilename);
//
//    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
//      method: 'POST',
//      body: formData,
//    });
//
//    const result = await response.json();
//    console.log(result);
//}


export async function ActualizarPerfil(file: File, id:string|undefined) {
  const formData = new FormData();
  formData.append('file', file);
  console.log(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/foto`);
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}/foto`, {
    method: 'POST',
    body: formData,
  });
}