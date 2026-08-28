// Tipos compartidos para los datos mockeados de Patuki.
// Reflejan el modelo de datos borrador: Usuario, Veterinaria, Mascota,
// RegistroMedico, Refugio y MascotaEnAdopcion.

export type Rol = 'dueño' | 'veterinario' | 'refugio' | 'admin'

export interface Usuario {
  id: string
  nombre: string
  email: string
  rol: Rol
  telefono?: string
  comuna?: string
}

export interface Veterinaria {
  id: string
  nombre: string
  direccion: string
  comuna: string
  telefono: string
  email: string
}

export type EstadoControl = 'al_dia' | 'pendiente' | 'atrasado'
export type TipoRegistroMedico = 'vacuna' | 'control' | 'tratamiento' | 'desparasitacion' | 'examen'

export interface RegistroMedico {
  id: string
  tipo: TipoRegistroMedico
  descripcion: string
  fecha: string // ISO date (YYYY-MM-DD)
  proximaFecha?: string // ISO date
  veterinariaId: string
  veterinario: string
  estado: EstadoControl
}

export type Especie = 'perro' | 'gato' | 'otro'
export type Sexo = 'macho' | 'hembra'

export interface Mascota {
  id: string
  nombre: string
  especie: Especie
  raza: string
  edad: number // años
  sexo: Sexo
  peso: number // kg
  duenoId: string
  veterinariaId: string
  historial: RegistroMedico[]
}

export interface Refugio {
  id: string
  nombre: string
  comuna: string
  telefono: string
  email: string
  sitioWeb?: string
}

export type NivelEnergia = 'bajo' | 'medio' | 'alto'
export type Tamano = 'pequeño' | 'mediano' | 'grande'

export interface PerfilCompatibilidad {
  nivelEnergia: NivelEnergia
  tamano: Tamano
  aptoNinos: boolean
  aptoOtrasMascotas: boolean
}

export interface MascotaEnAdopcion {
  id: string
  nombre: string
  especie: Extract<Especie, 'perro' | 'gato'>
  raza: string
  edadAprox: number
  sexo: Sexo
  refugioId: string
  descripcion: string
  perfil: PerfilCompatibilidad
  fechaIngreso: string // ISO date
  disponible: boolean
}
