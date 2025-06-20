

export interface ONGRequest {
  id: number;
  nombre: string;
  contacto: string;
  descripcion: string;
}

const ongRequests: ONGRequest[] = [
  {
    id: 1,
    nombre: ' Solidarios pora los animales',
    contacto: 'Lucía Gómez',
    descripcion: 'Apoyo para animales en malas condiciones en barrios vulnerables',
  },
  {
    id: 2,
    nombre: 'Unidos por los Animales',
    contacto: 'Matías Romero',
    descripcion: 'Unidad de personas con mucho amor y respetos a los Animales',
  },
];

export default ongRequests;
