
import { type Centro } from '../interfaces';

// podría ser agregarle un id autoincremental en algun momento. 

export const centrosMock: Centro[] = [
  {
    id: 1,
    nombre: "Clínica VetSur",
    direccion: "Av. Providencia 1234",
    comuna: "Providencia",
    telefono: 56225551010, // debemos truncarlo luego de forma que con un string agreguemos un '+' para que sea +56 2 blabla
    horarioApertura: 900, // 09:00
    horarioCierre: 2000, // luego con un string le pondremos un ':' para dejarlo tipo 20:00 
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
    especialidades: ["medicina general", "cirugia", "imagenologia"],
  },
  {
    id: 2,
    nombre: "Centro Veterinario Las Condes",
    direccion: "Av. Apoquindo 5678",
    comuna: "Las Condes",
    telefono: 56227772020,
    horarioApertura: 830, // 08:30
    horarioCierre: 1900, // 19:00
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes"],
    especialidades: ["medicina general", "dermatologia", "laboratorio"],
  },
  {
    id: 3,
    nombre: "PetLab Diagnóstico",
    direccion: "Manuel Montt 890",
    comuna: "Ñuñoa",
    telefono: 56229993030,
    horarioApertura: 900, // 09:00
    horarioCierre: 1800, // 18:00
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes"],
    especialidades: ["laboratorio", "radiografia", "ecografia"],
  },
  {
    id: 4,
    nombre: "Veterinaria Maipú Sur",
    direccion: "Av. Pajaritos 3200",
    comuna: "Maipú",
    telefono: 56224456060,
    horarioApertura: 900, // 09:00
    horarioCierre: 1900, // 19:00 
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
    especialidades: ["medicina general", "traumatologia"],
  },
  {
    id: 5,
    nombre: "Centro Veterinario Vitacura",
    direccion: "Av. Vitacura 8900",
    comuna: "Vitacura",
    telefono: 56223347070,
    horarioApertura: 800, // 08:00
    horarioCierre: 2000, // 20:00 
    diasAtencion: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado"],
    especialidades: ["oftalmologia", "odontologia veterinaria", "medicina general"],
  },
];
