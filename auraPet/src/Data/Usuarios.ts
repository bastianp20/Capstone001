
import { type Usuario } from '../interfaces';

export const usuariosMock: Usuario[] = [
  // ---------- Dueños ----------
  { id: "u-001", nombre: "Camila Rojas", email: "camila.rojas@example.com", rol: "dueno", telefono: "+56 9 1234 5678", creadoEn: "2022-11-02T10:15:00Z" },
  { id: "u-002", nombre: "Matías Fuentes", email: "matias.fuentes@example.com", rol: "dueno", telefono: "+56 9 8765 4321", creadoEn: "2022-12-10T09:00:00Z" },
  { id: "u-007", nombre: "Francisca Muñoz", email: "francisca.munoz@example.com", rol: "dueno", telefono: "+56 9 5551 2233", creadoEn: "2023-01-18T12:00:00Z" },
  { id: "u-008", nombre: "Sebastián Vargas", email: "sebastian.vargas@example.com", rol: "dueno", telefono: "+56 9 6642 1190", creadoEn: "2023-03-05T15:40:00Z" },
  { id: "u-009", nombre: "Javiera Torres", email: "javiera.torres@example.com", rol: "dueno", telefono: "+56 9 7123 8890", creadoEn: "2023-05-22T09:30:00Z" },
  { id: "u-010", nombre: "Cristóbal Silva", email: "cristobal.silva@example.com", rol: "dueno", telefono: "+56 9 4456 7712", creadoEn: "2023-07-14T11:05:00Z" },
  { id: "u-011", nombre: "Antonia Herrera", email: "antonia.herrera@example.com", rol: "dueno", telefono: "+56 9 3321 9987", creadoEn: "2023-09-30T14:20:00Z" },
  { id: "u-012", nombre: "Diego Contreras", email: "diego.contreras@example.com", rol: "dueno", telefono: "+56 9 2214 5567", creadoEn: "2024-01-11T08:45:00Z" },
  { id: "u-013", nombre: "Valentina Castro", email: "valentina.castro@example.com", rol: "dueno", telefono: "+56 9 9987 6541", creadoEn: "2024-04-02T16:10:00Z" },
  { id: "u-014", nombre: "Felipe Morales", email: "felipe.morales@example.com", rol: "dueno", telefono: "+56 9 8812 3345", creadoEn: "2024-08-19T10:55:00Z" },
  { id: "u-015", nombre: "Josefina Reyes", email: "josefina.reyes@example.com", rol: "dueno", telefono: "+56 9 7765 4432", creadoEn: "2025-02-27T13:30:00Z" },
  { id: "u-016", nombre: "Tomás Espinoza", email: "tomas.espinoza@example.com", rol: "dueno", telefono: "+56 9 6654 3321", creadoEn: "2025-11-06T09:15:00Z" },

  // ---------- Veterinarios ----------
  { id: "u-003", nombre: "Dra. Valentina Soto", email: "valentina.soto@auravet.com", rol: "veterinario", telefono: "+56 9 2222 3333", creadoEn: "2022-09-20T08:00:00Z" },
  { id: "u-004", nombre: "Dr. Ignacio Pérez", email: "ignacio.perez@auravet.com", rol: "veterinario", telefono: "+56 9 4444 5555", creadoEn: "2022-09-22T08:00:00Z" },
  { id: "u-017", nombre: "Dr. Andrés Cortés", email: "andres.cortes@auravet.com", rol: "veterinario", telefono: "+56 9 5563 2210", creadoEn: "2023-02-14T09:00:00Z" },
  { id: "u-018", nombre: "Dra. Antonia Reyes", email: "antonia.reyes@auravet.com", rol: "veterinario", telefono: "+56 9 6674 3321", creadoEn: "2023-06-08T09:00:00Z" },
  { id: "u-019", nombre: "Dr. Rodrigo Vidal", email: "rodrigo.vidal@auravet.com", rol: "veterinario", telefono: "+56 9 7785 4432", creadoEn: "2023-12-01T09:00:00Z" },
  { id: "u-020", nombre: "Dra. Bárbara Fuenzalida", email: "barbara.fuenzalida@auravet.com", rol: "veterinario", telefono: "+56 9 8896 5543", creadoEn: "2024-05-19T09:00:00Z" },
  { id: "u-021", nombre: "Dr. Matías Ojeda", email: "matias.ojeda@auravet.com", rol: "veterinario", telefono: "+56 9 9907 6654", creadoEn: "2025-03-27T09:00:00Z" },

  // ---------- Centros ----------
  { id: "u-005", nombre: "Clínica VetSur", email: "contacto@vetsur.com", rol: "centro", telefono: "+56 2 2555 1010", creadoEn: "2022-08-01T08:00:00Z" },
  { id: "u-022", nombre: "Centro Veterinario Las Condes", email: "contacto@vetlascondes.com", rol: "centro", telefono: "+56 2 2777 2020", creadoEn: "2022-08-15T08:00:00Z" },
  { id: "u-023", nombre: "PetLab Diagnóstico", email: "contacto@petlab.cl", rol: "centro", telefono: "+56 2 2999 3030", creadoEn: "2022-10-05T08:00:00Z" },
  { id: "u-024", nombre: "Veterinaria Maipú Sur", email: "contacto@vetmaipusur.cl", rol: "centro", telefono: "+56 2 2445 6060", creadoEn: "2023-11-20T08:00:00Z" },
  { id: "u-025", nombre: "Centro Veterinario Vitacura", email: "contacto@vetvitacura.cl", rol: "centro", telefono: "+56 2 2334 7070", creadoEn: "2024-06-10T08:00:00Z" },

  // ---------- SuperAdmin ----------
  { id: "u-006", nombre: "Bastian", email: "bastian.palavecino89@gmail.com", rol: "superadmin", creadoEn: "2022-07-01T08:00:00Z" },
];
