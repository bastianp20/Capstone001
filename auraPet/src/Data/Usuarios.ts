import { type Usuario } from '../interfaces';

// Los ids de Usuario son únicos a través de TODOS los roles (dueño,
// veterinario, centro, superadmin), tal como sería en una única tabla
// "usuarios" real. Por eso cada arreglo usa un rango de ids propio en
// vez de reiniciar en 1: dueño (1-2, 7-16), veterinario (3-4, 17-21),
// superadmin (5) y centro (22-26). Los ids 6 y del 27 en adelante
// quedan libres para futuras altas.
// Los ids de veterinarioId/duenoId/centroId usados en el resto de la
// carpeta Data (Mascota, Cita, Veterinarios, etc.) referencian
// directamente estos mismos ids de Usuario.
//
// password: MOCK — cada usuario tiene una contraseña distinta (primer
// nombre en minúscula sin tildes + su id, ej. "camila1") solo para poder
// probar el login con varias cuentas. Se reemplaza entero cuando
// conectemos Supabase Auth. Lista completa en credenciales-login-aurapet.txt.

export const dueno: Usuario[] = [
  { id: 1, nombre: "Camila Rojas", email: "camila.rojas@example.com", rol: "dueno", telefono: 56912345678, creadoEn: 20221102, password: "camila1" },
  { id: 2, nombre: "Matías Fuentes", email: "matias.fuentes@example.com", rol: "dueno", telefono: 56987654321, creadoEn: 20221210, password: "matias2" },
  { id: 7, nombre: "Francisca Muñoz", email: "francisca.munoz@example.com", rol: "dueno", telefono: 56955512233, creadoEn: 20230118, password: "francisca7" },
  { id: 8, nombre: "Sebastián Vargas", email: "sebastian.vargas@example.com", rol: "dueno", telefono: 56966421190, creadoEn: 20230305, password: "sebastian8" },
  { id: 9, nombre: "Javiera Torres", email: "javiera.torres@example.com", rol: "dueno", telefono: 56971238890, creadoEn: 20230522, password: "javiera9" },
  { id: 10, nombre: "Cristóbal Silva", email: "cristobal.silva@example.com", rol: "dueno", telefono: 56944567712, creadoEn: 20230714, password: "cristobal10" },
  { id: 11, nombre: "Antonia Herrera", email: "antonia.herrera@example.com", rol: "dueno", telefono: 56933219987, creadoEn: 20230930, password: "antonia11" },
  { id: 12, nombre: "Diego Contreras", email: "diego.contreras@example.com", rol: "dueno", telefono: 56922145567, creadoEn: 20240111, password: "diego12" },
  { id: 13, nombre: "Valentina Castro", email: "valentina.castro@example.com", rol: "dueno", telefono: 56999876541, creadoEn: 20240402, password: "valentina13" },
  { id: 14, nombre: "Felipe Morales", email: "felipe.morales@example.com", rol: "dueno", telefono: 56988123345, creadoEn: 20240819, password: "felipe14" },
  { id: 15, nombre: "Josefina Reyes", email: "josefina.reyes@example.com", rol: "dueno", telefono: 56977654432, creadoEn: 20250227, password: "josefina15" },
  { id: 16, nombre: "Tomás Espinoza", email: "tomas.espinoza@example.com", rol: "dueno", telefono: 56966543321, creadoEn: 20251106, password: "tomas16" },
];

export const superAdmin: Usuario[] = [
  { id: 5, nombre: "Bastian", email: "bastian.palavecino89@gmail.com", rol: "superadmin", creadoEn: 20220701, password: "bastian5" }, // este usuario fue creado el 01 del 07 del 2022
];

export const Veterinarios: Usuario[] = [
  // desde la página de los veterinarios se le agregará un "dr" si es hombre, si es mujer será "dra".
  { id: 3, nombre: "Valentina Soto", email: "valentina.soto@auravet.com", rol: "veterinario", telefono: 56922223333, creadoEn: 20220920, password: "valentina3" },
  { id: 4, nombre: "Ignacio Pérez", email: "ignacio.perez@auravet.com", rol: "veterinario", telefono: 56944445555, creadoEn: 20220922, password: "ignacio4" },
  { id: 17, nombre: "Andrés Cortés", email: "andres.cortes@auravet.com", rol: "veterinario", telefono: 56955632210, creadoEn: 20230214, password: "andres17" },
  { id: 18, nombre: "Antonia Reyes", email: "antonia.reyes@auravet.com", rol: "veterinario", telefono: 56966743321, creadoEn: 20230608, password: "antonia18" },
  { id: 19, nombre: "Rodrigo Vidal", email: "rodrigo.vidal@auravet.com", rol: "veterinario", telefono: 56977854432, creadoEn: 20231201, password: "rodrigo19" },
  { id: 20, nombre: "Bárbara Fuenzalida", email: "barbara.fuenzalida@auravet.com", rol: "veterinario", telefono: 56988965543, creadoEn: 20240519, password: "barbara20" },
  { id: 21, nombre: "Matías Ojeda", email: "matias.ojeda@auravet.com", rol: "veterinario", telefono: 56999076654, creadoEn: 20250327, password: "matias21" },
];

export const centros: Usuario[] = [
  { id: 22, nombre: "Clínica VetSur", email: "contacto@vetsur.com", rol: "centro", telefono: 56225551010, creadoEn: 20220801, password: "clinica22" },
  { id: 23, nombre: "Centro Veterinario Las Condes", email: "contacto@vetlascondes.com", rol: "centro", telefono: 56227772020, creadoEn: 20220815, password: "centro23" },
  { id: 24, nombre: "PetLab Diagnóstico", email: "contacto@petlab.cl", rol: "centro", telefono: 56229993030, creadoEn: 20221005, password: "petlab24" },
  { id: 25, nombre: "Veterinaria Maipú Sur", email: "contacto@vetmaipusur.cl", rol: "centro", telefono: 56224456060, creadoEn: 20231120, password: "veterinaria25" },
  { id: 26, nombre: "Centro Veterinario Vitacura", email: "contacto@vetvitacura.cl", rol: "centro", telefono: 56223347070, creadoEn: 20240610, password: "centro26" },
];

// Tabla única de usuarios (une los 4 roles). Es la que consumen las
// funciones de Api/getInfo.tsx para resolver nombres a partir de un id,
// igual que una query real a una sola tabla "usuarios".
export const usuariosMock: Usuario[] = [...dueno, ...superAdmin, ...Veterinarios, ...centros];
