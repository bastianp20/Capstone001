export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      admins_centro: {
        Row: {
          asignado_en: string
          asignado_por: string | null
          centro_id: number
          perfil_id: string
        }
        Insert: {
          asignado_en?: string
          asignado_por?: string | null
          centro_id: number
          perfil_id: string
        }
        Update: {
          asignado_en?: string
          asignado_por?: string | null
          centro_id?: number
          perfil_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_centro_asignado_por_fkey"
            columns: ["asignado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_centro_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admins_centro_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      adopciones: {
        Row: {
          actualizada_en: string
          adoptada_en: string | null
          adoptante_id: string | null
          alergias: string | null
          comuna: string
          con_microchip: boolean
          creada_en: string
          energia: number | null
          es_prueba: boolean
          especie: Database["public"]["Enums"]["especie_mascota"]
          estado: string
          esterilizado: boolean
          fecha_nacimiento: string | null
          foto_url: string | null
          fotos: string[]
          frase: string | null
          historia: string | null
          id: number
          microchip: string | null
          nombre: string
          personalidad: string[]
          peso_kg: number | null
          publicado_por: string
          raza: string | null
          sexo: Database["public"]["Enums"]["sexo_mascota"]
          sociable_gatos: number | null
          sociable_ninos: number | null
          sociable_perros: number | null
          solicita_chequeo: boolean
          tamano: string
          testimonio: string | null
          testimonio_autor: string | null
          vacunas_al_dia: boolean
        }
        Insert: {
          actualizada_en?: string
          adoptada_en?: string | null
          adoptante_id?: string | null
          alergias?: string | null
          comuna: string
          con_microchip?: boolean
          creada_en?: string
          energia?: number | null
          es_prueba?: boolean
          especie: Database["public"]["Enums"]["especie_mascota"]
          estado?: string
          esterilizado?: boolean
          fecha_nacimiento?: string | null
          foto_url?: string | null
          fotos?: string[]
          frase?: string | null
          historia?: string | null
          id?: never
          microchip?: string | null
          nombre: string
          personalidad?: string[]
          peso_kg?: number | null
          publicado_por: string
          raza?: string | null
          sexo: Database["public"]["Enums"]["sexo_mascota"]
          sociable_gatos?: number | null
          sociable_ninos?: number | null
          sociable_perros?: number | null
          solicita_chequeo?: boolean
          tamano: string
          testimonio?: string | null
          testimonio_autor?: string | null
          vacunas_al_dia?: boolean
        }
        Update: {
          actualizada_en?: string
          adoptada_en?: string | null
          adoptante_id?: string | null
          alergias?: string | null
          comuna?: string
          con_microchip?: boolean
          creada_en?: string
          energia?: number | null
          es_prueba?: boolean
          especie?: Database["public"]["Enums"]["especie_mascota"]
          estado?: string
          esterilizado?: boolean
          fecha_nacimiento?: string | null
          foto_url?: string | null
          fotos?: string[]
          frase?: string | null
          historia?: string | null
          id?: never
          microchip?: string | null
          nombre?: string
          personalidad?: string[]
          peso_kg?: number | null
          publicado_por?: string
          raza?: string | null
          sexo?: Database["public"]["Enums"]["sexo_mascota"]
          sociable_gatos?: number | null
          sociable_ninos?: number | null
          sociable_perros?: number | null
          solicita_chequeo?: boolean
          tamano?: string
          testimonio?: string | null
          testimonio_autor?: string | null
          vacunas_al_dia?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "adopciones_adoptante_id_fkey"
            columns: ["adoptante_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "adopciones_publicado_por_fkey"
            columns: ["publicado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias_contacto: {
        Row: {
          pregunta: string
          respuesta: string
          slug: string
        }
        Insert: {
          pregunta: string
          respuesta: string
          slug: string
        }
        Update: {
          pregunta?: string
          respuesta?: string
          slug?: string
        }
        Relationships: []
      }
      centro_especialidades: {
        Row: {
          centro_id: number
          especialidad_id: number
        }
        Insert: {
          centro_id: number
          especialidad_id: number
        }
        Update: {
          centro_id?: number
          especialidad_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "centro_especialidades_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "centro_especialidades_especialidad_id_fkey"
            columns: ["especialidad_id"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
        ]
      }
      centros: {
        Row: {
          comuna: string
          creado_en: string
          creado_por: string | null
          direccion: string
          es_prueba: boolean
          estado_verificacion: Database["public"]["Enums"]["estado_verificacion"]
          id: number
          motivo_rechazo: string | null
          nombre: string
          revisado_en: string | null
          revisado_por: string | null
          telefono: number | null
        }
        Insert: {
          comuna: string
          creado_en?: string
          creado_por?: string | null
          direccion: string
          es_prueba?: boolean
          estado_verificacion?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          motivo_rechazo?: string | null
          nombre: string
          revisado_en?: string | null
          revisado_por?: string | null
          telefono?: number | null
        }
        Update: {
          comuna?: string
          creado_en?: string
          creado_por?: string | null
          direccion?: string
          es_prueba?: boolean
          estado_verificacion?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          motivo_rechazo?: string | null
          nombre?: string
          revisado_en?: string | null
          revisado_por?: string | null
          telefono?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "centros_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "centros_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chequeos_adopcion: {
        Row: {
          adopcion_id: number
          centro_id: number | null
          creado_en: string
          fecha: string
          id: number
          resumen: string
          solidario: boolean
          veterinario_id: number
        }
        Insert: {
          adopcion_id: number
          centro_id?: number | null
          creado_en?: string
          fecha?: string
          id?: never
          resumen: string
          solidario?: boolean
          veterinario_id: number
        }
        Update: {
          adopcion_id?: number
          centro_id?: number | null
          creado_en?: string
          fecha?: string
          id?: never
          resumen?: string
          solidario?: boolean
          veterinario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "chequeos_adopcion_adopcion_id_fkey"
            columns: ["adopcion_id"]
            isOneToOne: false
            referencedRelation: "adopciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chequeos_adopcion_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chequeos_adopcion_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      citas: {
        Row: {
          cancelada_por: string | null
          centro_id: number | null
          creada_en: string
          estado: Database["public"]["Enums"]["estado_cita"]
          fecha_hora: string
          id: number
          mascota_id: number
          motivo: string
          motivo_cancelacion: string | null
          sintomas_reportados: string[]
          urgencia: Database["public"]["Enums"]["urgencia_cita"] | null
          urgencia_sugerida: Database["public"]["Enums"]["urgencia_cita"] | null
          veterinario_id: number | null
        }
        Insert: {
          cancelada_por?: string | null
          centro_id?: number | null
          creada_en?: string
          estado?: Database["public"]["Enums"]["estado_cita"]
          fecha_hora: string
          id?: never
          mascota_id: number
          motivo: string
          motivo_cancelacion?: string | null
          sintomas_reportados?: string[]
          urgencia?: Database["public"]["Enums"]["urgencia_cita"] | null
          urgencia_sugerida?:
            | Database["public"]["Enums"]["urgencia_cita"]
            | null
          veterinario_id?: number | null
        }
        Update: {
          cancelada_por?: string | null
          centro_id?: number | null
          creada_en?: string
          estado?: Database["public"]["Enums"]["estado_cita"]
          fecha_hora?: string
          id?: never
          mascota_id?: number
          motivo?: string
          motivo_cancelacion?: string | null
          sintomas_reportados?: string[]
          urgencia?: Database["public"]["Enums"]["urgencia_cita"] | null
          urgencia_sugerida?:
            | Database["public"]["Enums"]["urgencia_cita"]
            | null
          veterinario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "citas_cancelada_por_fkey"
            columns: ["cancelada_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_mascota_id_fkey"
            columns: ["mascota_id"]
            isOneToOne: false
            referencedRelation: "mascotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "citas_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      derivaciones: {
        Row: {
          a_centro_id: number | null
          a_veterinario_id: number | null
          creada_en: string
          estado: Database["public"]["Enums"]["estado_derivacion"]
          id: number
          motivo: string
          registro_id: number
          resultado: string | null
        }
        Insert: {
          a_centro_id?: number | null
          a_veterinario_id?: number | null
          creada_en?: string
          estado?: Database["public"]["Enums"]["estado_derivacion"]
          id?: never
          motivo: string
          registro_id: number
          resultado?: string | null
        }
        Update: {
          a_centro_id?: number | null
          a_veterinario_id?: number | null
          creada_en?: string
          estado?: Database["public"]["Enums"]["estado_derivacion"]
          id?: never
          motivo?: string
          registro_id?: number
          resultado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "derivaciones_a_centro_id_fkey"
            columns: ["a_centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derivaciones_a_veterinario_id_fkey"
            columns: ["a_veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "derivaciones_registro_id_fkey"
            columns: ["registro_id"]
            isOneToOne: false
            referencedRelation: "registros_medicos"
            referencedColumns: ["id"]
          },
        ]
      }
      especialidades: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: never
          nombre: string
        }
        Update: {
          id?: never
          nombre?: string
        }
        Relationships: []
      }
      historial_suscripcion: {
        Row: {
          accion: string
          centro_id: number
          creado_en: string
          detalle: string | null
          estado: string
          id: number
        }
        Insert: {
          accion: string
          centro_id: number
          creado_en?: string
          detalle?: string | null
          estado?: string
          id?: never
        }
        Update: {
          accion?: string
          centro_id?: number
          creado_en?: string
          detalle?: string | null
          estado?: string
          id?: never
        }
        Relationships: [
          {
            foreignKeyName: "historial_suscripcion_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios_centro: {
        Row: {
          abre: string
          centro_id: number
          cierra: string
          dia_semana: number
          fin_colacion: string | null
          inicio_colacion: string | null
        }
        Insert: {
          abre: string
          centro_id: number
          cierra: string
          dia_semana: number
          fin_colacion?: string | null
          inicio_colacion?: string | null
        }
        Update: {
          abre?: string
          centro_id?: number
          cierra?: string
          dia_semana?: number
          fin_colacion?: string | null
          inicio_colacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horarios_centro_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
        ]
      }
      horarios_veterinario: {
        Row: {
          centro_id: number
          desde: string
          dia_semana: number
          duracion_cita_min: number
          hasta: string
          id: number
          veterinario_id: number
        }
        Insert: {
          centro_id: number
          desde: string
          dia_semana: number
          duracion_cita_min?: number
          hasta: string
          id?: never
          veterinario_id: number
        }
        Update: {
          centro_id?: number
          desde?: string
          dia_semana?: number
          duracion_cita_min?: number
          hasta?: string
          id?: never
          veterinario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "horarios_veterinario_veterinario_id_centro_id_fkey"
            columns: ["veterinario_id", "centro_id"]
            isOneToOne: false
            referencedRelation: "veterinario_centros"
            referencedColumns: ["veterinario_id", "centro_id"]
          },
        ]
      }
      mascotas: {
        Row: {
          alergias: string | null
          condiciones_cronicas: string | null
          creado_en: string
          dueno_id: string | null
          especie: Database["public"]["Enums"]["especie_mascota"]
          esterilizado: boolean
          fecha_nacimiento: string | null
          foto_url: string | null
          id: number
          microchip: string | null
          nombre: string
          peso_kg: number | null
          raza: string | null
          sexo: Database["public"]["Enums"]["sexo_mascota"]
        }
        Insert: {
          alergias?: string | null
          condiciones_cronicas?: string | null
          creado_en?: string
          dueno_id?: string | null
          especie: Database["public"]["Enums"]["especie_mascota"]
          esterilizado?: boolean
          fecha_nacimiento?: string | null
          foto_url?: string | null
          id?: never
          microchip?: string | null
          nombre: string
          peso_kg?: number | null
          raza?: string | null
          sexo: Database["public"]["Enums"]["sexo_mascota"]
        }
        Update: {
          alergias?: string | null
          condiciones_cronicas?: string | null
          creado_en?: string
          dueno_id?: string | null
          especie?: Database["public"]["Enums"]["especie_mascota"]
          esterilizado?: boolean
          fecha_nacimiento?: string | null
          foto_url?: string | null
          id?: never
          microchip?: string | null
          nombre?: string
          peso_kg?: number | null
          raza?: string | null
          sexo?: Database["public"]["Enums"]["sexo_mascota"]
        }
        Relationships: [
          {
            foreignKeyName: "mascotas_dueno_id_fkey"
            columns: ["dueno_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mensajes_contacto: {
        Row: {
          asunto: string
          categoria: string | null
          correo: string
          creado_en: string
          estado: Database["public"]["Enums"]["estado_contacto"]
          id: number
          mensaje: string
          nombre: string
          telefono: number | null
        }
        Insert: {
          asunto: string
          categoria?: string | null
          correo: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_contacto"]
          id?: never
          mensaje: string
          nombre: string
          telefono?: number | null
        }
        Update: {
          asunto?: string
          categoria?: string | null
          correo?: string
          creado_en?: string
          estado?: Database["public"]["Enums"]["estado_contacto"]
          id?: never
          mensaje?: string
          nombre?: string
          telefono?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mensajes_contacto_categoria_fkey"
            columns: ["categoria"]
            isOneToOne: false
            referencedRelation: "categorias_contacto"
            referencedColumns: ["slug"]
          },
        ]
      }
      notas: {
        Row: {
          actualizada_en: string
          color: string
          contenido: string
          creada_en: string
          fijada: boolean
          id: number
          perfil_id: string
          titulo: string
        }
        Insert: {
          actualizada_en?: string
          color?: string
          contenido?: string
          creada_en?: string
          fijada?: boolean
          id?: never
          perfil_id?: string
          titulo: string
        }
        Update: {
          actualizada_en?: string
          color?: string
          contenido?: string
          creada_en?: string
          fijada?: boolean
          id?: never
          perfil_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      perfiles: {
        Row: {
          avatar_url: string | null
          creado_en: string
          desactivado_en: string | null
          es_prueba: boolean
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: number | null
        }
        Insert: {
          avatar_url?: string | null
          creado_en?: string
          desactivado_en?: string | null
          es_prueba?: boolean
          id: string
          nombre: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: number | null
        }
        Update: {
          avatar_url?: string | null
          creado_en?: string
          desactivado_en?: string | null
          es_prueba?: boolean
          id?: string
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: number | null
        }
        Relationships: []
      }
      planes: {
        Row: {
          id: string
          limite_veterinarios: number | null
          nombre: string
          orden: number
          precio_mensual: number
        }
        Insert: {
          id: string
          limite_veterinarios?: number | null
          nombre: string
          orden: number
          precio_mensual: number
        }
        Update: {
          id?: string
          limite_veterinarios?: number | null
          nombre?: string
          orden?: number
          precio_mensual?: number
        }
        Relationships: []
      }
      postulaciones_adopcion: {
        Row: {
          adopcion_id: number
          creada_en: string
          cuales_mascotas: string | null
          edades_ninos: string | null
          estado: string
          experiencia: string | null
          hay_ninos: boolean
          id: number
          motivo: string
          otras_mascotas: boolean
          permiten_mascotas: boolean | null
          postulante_id: string
          revisada_en: string | null
          tenencia: string
          tiene_patio: boolean
          todos_de_acuerdo: boolean
          vivienda: string
        }
        Insert: {
          adopcion_id: number
          creada_en?: string
          cuales_mascotas?: string | null
          edades_ninos?: string | null
          estado?: string
          experiencia?: string | null
          hay_ninos: boolean
          id?: never
          motivo: string
          otras_mascotas: boolean
          permiten_mascotas?: boolean | null
          postulante_id: string
          revisada_en?: string | null
          tenencia: string
          tiene_patio: boolean
          todos_de_acuerdo: boolean
          vivienda: string
        }
        Update: {
          adopcion_id?: number
          creada_en?: string
          cuales_mascotas?: string | null
          edades_ninos?: string | null
          estado?: string
          experiencia?: string | null
          hay_ninos?: boolean
          id?: never
          motivo?: string
          otras_mascotas?: boolean
          permiten_mascotas?: boolean | null
          postulante_id?: string
          revisada_en?: string | null
          tenencia?: string
          tiene_patio?: boolean
          todos_de_acuerdo?: boolean
          vivienda?: string
        }
        Relationships: [
          {
            foreignKeyName: "postulaciones_adopcion_adopcion_id_fkey"
            columns: ["adopcion_id"]
            isOneToOne: false
            referencedRelation: "adopciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postulaciones_adopcion_postulante_id_fkey"
            columns: ["postulante_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      receta_medicamentos: {
        Row: {
          dosis: string
          duracion: string
          frecuencia: string
          id: number
          nombre: string
          receta_id: number
        }
        Insert: {
          dosis: string
          duracion: string
          frecuencia: string
          id?: never
          nombre: string
          receta_id: number
        }
        Update: {
          dosis?: string
          duracion?: string
          frecuencia?: string
          id?: never
          nombre?: string
          receta_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "receta_medicamentos_receta_id_fkey"
            columns: ["receta_id"]
            isOneToOne: false
            referencedRelation: "recetas"
            referencedColumns: ["id"]
          },
        ]
      }
      recetas: {
        Row: {
          cita_id: number | null
          creada_en: string
          id: number
          indicaciones: string | null
          mascota_id: number
          proximo_control: string | null
          veterinario_id: number
        }
        Insert: {
          cita_id?: number | null
          creada_en?: string
          id?: never
          indicaciones?: string | null
          mascota_id: number
          proximo_control?: string | null
          veterinario_id: number
        }
        Update: {
          cita_id?: number | null
          creada_en?: string
          id?: never
          indicaciones?: string | null
          mascota_id?: number
          proximo_control?: string | null
          veterinario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "recetas_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recetas_mascota_id_fkey"
            columns: ["mascota_id"]
            isOneToOne: false
            referencedRelation: "mascotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recetas_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_medicos: {
        Row: {
          centro_id: number | null
          cita_id: number | null
          creado_en: string
          descripcion: string
          fecha: string
          id: number
          mascota_id: number
          proxima_dosis: string | null
          tipo: Database["public"]["Enums"]["tipo_registro"]
          tratamiento: string | null
          veterinario_id: number | null
        }
        Insert: {
          centro_id?: number | null
          cita_id?: number | null
          creado_en?: string
          descripcion: string
          fecha: string
          id?: never
          mascota_id: number
          proxima_dosis?: string | null
          tipo: Database["public"]["Enums"]["tipo_registro"]
          tratamiento?: string | null
          veterinario_id?: number | null
        }
        Update: {
          centro_id?: number | null
          cita_id?: number | null
          creado_en?: string
          descripcion?: string
          fecha?: string
          id?: never
          mascota_id?: number
          proxima_dosis?: string | null
          tipo?: Database["public"]["Enums"]["tipo_registro"]
          tratamiento?: string | null
          veterinario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_medicos_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_medicos_cita_id_fkey"
            columns: ["cita_id"]
            isOneToOne: false
            referencedRelation: "citas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_medicos_mascota_id_fkey"
            columns: ["mascota_id"]
            isOneToOne: false
            referencedRelation: "mascotas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_medicos_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_centro: {
        Row: {
          cargo: string
          centro_id: number | null
          comuna: string
          correo: string
          creado_en: string
          direccion: string
          especialidad_ids: number[]
          estado: Database["public"]["Enums"]["estado_verificacion"]
          id: number
          mensaje: string | null
          motivo_rechazo: string | null
          nombre_centro: string
          nombre_responsable: string
          revisado_en: string | null
          revisado_por: string | null
          sitio_web: string | null
          telefono_centro: number
          telefono_responsable: number
        }
        Insert: {
          cargo: string
          centro_id?: number | null
          comuna: string
          correo: string
          creado_en?: string
          direccion: string
          especialidad_ids?: number[]
          estado?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          mensaje?: string | null
          motivo_rechazo?: string | null
          nombre_centro: string
          nombre_responsable: string
          revisado_en?: string | null
          revisado_por?: string | null
          sitio_web?: string | null
          telefono_centro: number
          telefono_responsable: number
        }
        Update: {
          cargo?: string
          centro_id?: number | null
          comuna?: string
          correo?: string
          creado_en?: string
          direccion?: string
          especialidad_ids?: number[]
          estado?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          mensaje?: string | null
          motivo_rechazo?: string | null
          nombre_centro?: string
          nombre_responsable?: string
          revisado_en?: string | null
          revisado_por?: string | null
          sitio_web?: string | null
          telefono_centro?: number
          telefono_responsable?: number
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_centro_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_centro_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_eliminacion: {
        Row: {
          creada_en: string
          estado: string
          id: number
          motivo: string | null
          perfil_id: string
          respuesta: string | null
          resuelta_en: string | null
          resuelta_por: string | null
        }
        Insert: {
          creada_en?: string
          estado?: string
          id?: never
          motivo?: string | null
          perfil_id: string
          respuesta?: string | null
          resuelta_en?: string | null
          resuelta_por?: string | null
        }
        Update: {
          creada_en?: string
          estado?: string
          id?: never
          motivo?: string | null
          perfil_id?: string
          respuesta?: string | null
          resuelta_en?: string | null
          resuelta_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_eliminacion_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_eliminacion_resuelta_por_fkey"
            columns: ["resuelta_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      solicitudes_plan: {
        Row: {
          centro_id: number
          creado_en: string
          estado: string
          id: number
          mensaje: string | null
          plan_id: string
          solicitado_por: string | null
        }
        Insert: {
          centro_id: number
          creado_en?: string
          estado?: string
          id?: never
          mensaje?: string | null
          plan_id: string
          solicitado_por?: string | null
        }
        Update: {
          centro_id?: number
          creado_en?: string
          estado?: string
          id?: never
          mensaje?: string | null
          plan_id?: string
          solicitado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "solicitudes_plan_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_plan_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "solicitudes_plan_solicitado_por_fkey"
            columns: ["solicitado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
      suscripciones_centro: {
        Row: {
          actualizado_en: string
          centro_id: number
          estado: Database["public"]["Enums"]["estado_suscripcion"]
          fin_prueba: string | null
          inicio: string
          plan_id: string
          renovacion: string | null
        }
        Insert: {
          actualizado_en?: string
          centro_id: number
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fin_prueba?: string | null
          inicio?: string
          plan_id: string
          renovacion?: string | null
        }
        Update: {
          actualizado_en?: string
          centro_id?: number
          estado?: Database["public"]["Enums"]["estado_suscripcion"]
          fin_prueba?: string | null
          inicio?: string
          plan_id?: string
          renovacion?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suscripciones_centro_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: true
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suscripciones_centro_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planes"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinario_centros: {
        Row: {
          centro_id: number
          veterinario_id: number
        }
        Insert: {
          centro_id: number
          veterinario_id: number
        }
        Update: {
          centro_id?: number
          veterinario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "veterinario_centros_centro_id_fkey"
            columns: ["centro_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinario_centros_veterinario_id_fkey"
            columns: ["veterinario_id"]
            isOneToOne: false
            referencedRelation: "veterinarios"
            referencedColumns: ["id"]
          },
        ]
      }
      veterinarios: {
        Row: {
          centro_mencionado: string | null
          centro_mencionado_comuna: string | null
          centro_solicitado_id: number | null
          creado_en: string
          especialidad_id: number | null
          especialidad_otra: string | null
          estado_verificacion: Database["public"]["Enums"]["estado_verificacion"]
          id: number
          motivo_rechazo: string | null
          numero_colegiado: string | null
          perfil_id: string | null
          revisado_en: string | null
          revisado_por: string | null
        }
        Insert: {
          centro_mencionado?: string | null
          centro_mencionado_comuna?: string | null
          centro_solicitado_id?: number | null
          creado_en?: string
          especialidad_id?: number | null
          especialidad_otra?: string | null
          estado_verificacion?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          motivo_rechazo?: string | null
          numero_colegiado?: string | null
          perfil_id?: string | null
          revisado_en?: string | null
          revisado_por?: string | null
        }
        Update: {
          centro_mencionado?: string | null
          centro_mencionado_comuna?: string | null
          centro_solicitado_id?: number | null
          creado_en?: string
          especialidad_id?: number | null
          especialidad_otra?: string | null
          estado_verificacion?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          motivo_rechazo?: string | null
          numero_colegiado?: string | null
          perfil_id?: string | null
          revisado_en?: string | null
          revisado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veterinarios_centro_solicitado_id_fkey"
            columns: ["centro_solicitado_id"]
            isOneToOne: false
            referencedRelation: "centros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarios_especialidad_id_fkey"
            columns: ["especialidad_id"]
            isOneToOne: false
            referencedRelation: "especialidades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarios_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veterinarios_revisado_por_fkey"
            columns: ["revisado_por"]
            isOneToOne: false
            referencedRelation: "perfiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      actualizar_datos_clinicos: {
        Args: {
          p_alergias?: string
          p_condiciones_cronicas?: string
          p_esterilizado?: boolean
          p_mascota_id: number
          p_microchip?: string
          p_peso_kg?: number
        }
        Returns: undefined
      }
      actualizar_mi_cita: {
        Args: {
          p_cita_id: number
          p_estado?: Database["public"]["Enums"]["estado_cita"]
          p_urgencia?: Database["public"]["Enums"]["urgencia_cita"]
        }
        Returns: undefined
      }
      agregar_registro_medico: {
        Args: {
          p_cita_id?: number
          p_descripcion: string
          p_fecha?: string
          p_mascota_id: number
          p_proxima_dosis?: string
          p_tipo: Database["public"]["Enums"]["tipo_registro"]
          p_tratamiento?: string
        }
        Returns: number
      }
      cancelar_mi_cita: {
        Args: { p_cita_id: number; p_motivo?: string }
        Returns: undefined
      }
      crear_centro: {
        Args: {
          p_comuna: string
          p_direccion: string
          p_es_prueba?: boolean
          p_especialidad_ids?: number[]
          p_horarios?: Json
          p_nombre: string
          p_telefono?: number
        }
        Returns: number
      }
      crear_derivacion: {
        Args: {
          p_a_centro_id?: number
          p_a_veterinario_id?: number
          p_mascota_id: number
          p_motivo: string
        }
        Returns: number
      }
      crear_receta: {
        Args: {
          p_cita_id?: number
          p_indicaciones?: string
          p_mascota_id: number
          p_medicamentos: Json
          p_proximo_control?: string
        }
        Returns: number
      }
      destinos_derivacion: {
        Args: never
        Returns: {
          detalle: string
          id: number
          nombre: string
          tipo: string
        }[]
      }
      detalle_adopcion: {
        Args: { p_id: number }
        Returns: {
          alergias: string
          chequeo_centro: string
          chequeo_fecha: string
          chequeo_resumen: string
          chequeo_solidario: boolean
          chequeo_veterinario: string
          comuna: string
          con_microchip: boolean
          creada_en: string
          energia: number
          es_mia: boolean
          especie: string
          estado: string
          esterilizado: boolean
          fecha_nacimiento: string
          fotos: string[]
          frase: string
          historia: string
          id: number
          nombre: string
          personalidad: string[]
          peso_kg: number
          publicador_adopciones: number
          publicador_nombre: string
          publicador_tipo: string
          raza: string
          sexo: string
          sociable_gatos: number
          sociable_ninos: number
          sociable_perros: number
          solicita_chequeo: boolean
          tamano: string
          vacunas_al_dia: boolean
          ya_postule: boolean
        }[]
      }
      detalle_centro: { Args: { p_centro_id: number }; Returns: Json }
      detalle_usuario: { Args: { p_perfil_id: string }; Returns: Json }
      es_admin_de_centro: { Args: { p_centro_id: number }; Returns: boolean }
      es_cuenta_de_prueba: { Args: never; Returns: boolean }
      es_dueno_de_mis_derivados: {
        Args: { p_perfil_id: string }
        Returns: boolean
      }
      es_dueno_de_mis_pacientes: {
        Args: { p_perfil_id: string }
        Returns: boolean
      }
      es_mi_mascota: { Args: { p_mascota_id: number }; Returns: boolean }
      es_mi_paciente: { Args: { p_mascota_id: number }; Returns: boolean }
      es_superadmin: { Args: never; Returns: boolean }
      es_veterinario_de_centro: {
        Args: { p_centro_id: number }
        Returns: boolean
      }
      especialidad_de_veterinario: {
        Args: { p_veterinario_id: number }
        Returns: string
      }
      estado_efectivo_suscripcion: {
        Args: {
          p_estado: Database["public"]["Enums"]["estado_suscripcion"]
          p_fin_prueba: string
          p_renovacion: string
        }
        Returns: Database["public"]["Enums"]["estado_suscripcion"]
      }
      extender_suscripcion: {
        Args: { p_centro_id: number; p_dias: number }
        Returns: undefined
      }
      ficha_pdf: { Args: { p_mascota_id: number }; Returns: Json }
      fotos_de_quien_publica: {
        Args: { p_fotos: string[]; p_publicado_por: string }
        Returns: boolean
      }
      historial_de_paciente: {
        Args: { p_mascota_id: number }
        Returns: {
          centro: string
          descripcion: string
          es_mio: boolean
          fecha: string
          id: number
          proxima_dosis: string
          tipo: Database["public"]["Enums"]["tipo_registro"]
          tratamiento: string
          veterinario: string
        }[]
      }
      historias_adopcion: {
        Args: { p_limite?: number }
        Returns: {
          adoptada_en: string
          especie: string
          foto_url: string
          id: number
          nombre: string
          testimonio: string
          testimonio_autor: string
        }[]
      }
      listar_adopciones: {
        Args: never
        Returns: {
          chequeo_centro: string
          chequeo_fecha: string
          chequeo_resumen: string
          chequeo_solidario: boolean
          chequeo_veterinario: string
          comuna: string
          creada_en: string
          especie: string
          estado: string
          esterilizado: boolean
          fecha_nacimiento: string
          foto_url: string
          frase: string
          historia: string
          id: number
          nombre: string
          personalidad: string[]
          raza: string
          sexo: string
          tamano: string
          vacunas_al_dia: boolean
        }[]
      }
      listar_citas: {
        Args: {
          p_busqueda?: string
          p_desde?: string
          p_estado?: Database["public"]["Enums"]["estado_cita"]
          p_hasta?: string
          p_limite?: number
          p_offset?: number
          p_orden?: string
          p_urgencia?: Database["public"]["Enums"]["urgencia_cita"]
        }
        Returns: {
          centro: string
          dueno: string
          es_prueba: boolean
          especie: Database["public"]["Enums"]["especie_mascota"]
          estado: Database["public"]["Enums"]["estado_cita"]
          fecha_hora: string
          id: number
          mascota: string
          motivo: string
          total: number
          urgencia: Database["public"]["Enums"]["urgencia_cita"]
          veterinario: string
        }[]
      }
      listar_derivaciones: {
        Args: { p_mascota_id?: number }
        Returns: {
          creada_en: string
          destino: string
          destino_tipo: string
          estado: Database["public"]["Enums"]["estado_derivacion"]
          id: number
          mascota: string
          mascota_id: number
          motivo: string
          origen: string
          puedo_cancelar: boolean
          puedo_responder: boolean
          resultado: string
        }[]
      }
      listar_solicitudes_eliminacion: {
        Args: never
        Returns: {
          correo: string
          creada_en: string
          estado: string
          id: number
          motivo: string
          nombre: string
          perfil_id: string
          respuesta: string
          resuelta_en: string
          rol: string
        }[]
      }
      listar_suscripciones: {
        Args: never
        Returns: {
          centro: string
          centro_id: number
          comuna: string
          es_prueba: boolean
          estado: Database["public"]["Enums"]["estado_suscripcion"]
          fin_prueba: string
          inicio: string
          limite: number
          mensaje: string
          plan_id: string
          plan_solicitado: string
          renovacion: string
          solicitado_en: string
          solicitado_por: string
          solicitud_id: number
          veterinarios: number
        }[]
      }
      listar_usuarios: {
        Args: never
        Returns: {
          creado_en: string
          desactivado_en: string
          email: string
          es_prueba: boolean
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: number
        }[]
      }
      me_derivaron: { Args: { p_mascota_id: number }; Returns: boolean }
      mi_veterinario_id: { Args: never; Returns: number }
      mis_datos: { Args: never; Returns: Json }
      mis_derivaciones: {
        Args: never
        Returns: {
          creada_en: string
          destino: string
          direccion: string
          dueno: string
          especie: Database["public"]["Enums"]["especie_mascota"]
          estado: Database["public"]["Enums"]["estado_derivacion"]
          id: number
          mascota: string
          mascota_id: number
          motivo: string
          origen: string
          resultado: string
        }[]
      }
      perfil_relacionado_con_mis_centros: {
        Args: { p_perfil_id: string }
        Returns: boolean
      }
      postular_adopcion: {
        Args: {
          p_adopcion_id: number
          p_cuales_mascotas: string
          p_edades_ninos: string
          p_experiencia: string
          p_hay_ninos: boolean
          p_motivo: string
          p_otras_mascotas: boolean
          p_permiten_mascotas: boolean
          p_tenencia: string
          p_tiene_patio: boolean
          p_todos_de_acuerdo: boolean
          p_vivienda: string
        }
        Returns: number
      }
      preguntas_frecuentes: {
        Args: { limite?: number }
        Returns: {
          cantidad: number
          pregunta: string
          respuesta: string
        }[]
      }
      rechazar_cita: {
        Args: { p_cita_id: number; p_motivo: string }
        Returns: undefined
      }
      resolver_solicitud_centro: {
        Args: {
          p_decision: Database["public"]["Enums"]["estado_verificacion"]
          p_motivo?: string
          p_solicitud_id: number
        }
        Returns: number
      }
      resolver_solicitud_eliminacion: {
        Args: {
          p_aprobar: boolean
          p_respuesta?: string
          p_solicitud_id: number
        }
        Returns: undefined
      }
      resolver_solicitud_plan: {
        Args: { p_aprobar: boolean; p_meses?: number; p_solicitud_id: number }
        Returns: undefined
      }
      responder_derivacion: {
        Args: {
          p_derivacion_id: number
          p_realizada: boolean
          p_resultado?: string
        }
        Returns: undefined
      }
      resumen_adopciones: {
        Args: never
        Returns: {
          con_familia: number
          esperando: number
          revisados: number
        }[]
      }
      resumen_suscripcion: {
        Args: { p_centro_id: number }
        Returns: {
          citas_mes: number
          estado: Database["public"]["Enums"]["estado_suscripcion"]
          fin_prueba: string
          inicio: string
          plan_id: string
          plan_solicitado: string
          renovacion: string
          veterinarios: number
        }[]
      }
      solicitar_cambio_plan: {
        Args: { p_centro_id: number; p_mensaje?: string; p_plan_id: string }
        Returns: undefined
      }
      solicitar_centro: {
        Args: {
          p_cargo: string
          p_comuna: string
          p_correo: string
          p_direccion: string
          p_especialidad_ids?: number[]
          p_mensaje?: string
          p_nombre_centro: string
          p_nombre_responsable: string
          p_sitio_web?: string
          p_telefono_centro: number
          p_telefono_responsable: number
        }
        Returns: number
      }
      solicitar_cita: {
        Args: {
          p_centro_id: number
          p_fecha_hora: string
          p_mascota_id: number
          p_motivo: string
          p_sintomas?: string[]
          p_veterinario_id?: number
        }
        Returns: number
      }
      solicitar_cita_independiente: {
        Args: {
          p_fecha_hora: string
          p_mascota_id: number
          p_motivo: string
          p_sintomas?: string[]
          p_veterinario_id: number
        }
        Returns: number
      }
      solicitar_eliminacion_cuenta: {
        Args: { p_motivo?: string }
        Returns: undefined
      }
      veterinarios_de_centro: {
        Args: { p_centro_id: number }
        Returns: {
          especialidad: string
          id: number
          nombre: string
        }[]
      }
      veterinarios_independientes: {
        Args: never
        Returns: {
          especialidad: string
          id: number
          nombre: string
        }[]
      }
    }
    Enums: {
      especie_mascota: "perro" | "gato" | "ave" | "conejo" | "otro"
      estado_cita:
        | "pendiente"
        | "confirmada"
        | "en_curso"
        | "completada"
        | "cancelada"
      estado_contacto: "pendiente" | "respondido" | "cerrado"
      estado_derivacion: "pendiente" | "realizada" | "cancelada"
      estado_suscripcion: "prueba" | "activa" | "vencida" | "cancelada"
      estado_verificacion: "pendiente" | "aprobado" | "rechazado"
      rol_usuario: "dueno" | "veterinario" | "superadmin" | "administrativo"
      sexo_mascota: "macho" | "hembra"
      tipo_registro: "diagnostico" | "vacuna" | "cirugia" | "control" | "otro"
      urgencia_cita: "baja" | "media" | "alta" | "critica"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      especie_mascota: ["perro", "gato", "ave", "conejo", "otro"],
      estado_cita: [
        "pendiente",
        "confirmada",
        "en_curso",
        "completada",
        "cancelada",
      ],
      estado_contacto: ["pendiente", "respondido", "cerrado"],
      estado_derivacion: ["pendiente", "realizada", "cancelada"],
      estado_suscripcion: ["prueba", "activa", "vencida", "cancelada"],
      estado_verificacion: ["pendiente", "aprobado", "rechazado"],
      rol_usuario: ["dueno", "veterinario", "superadmin", "administrativo"],
      sexo_mascota: ["macho", "hembra"],
      tipo_registro: ["diagnostico", "vacuna", "cirugia", "control", "otro"],
      urgencia_cita: ["baja", "media", "alta", "critica"],
    },
  },
} as const
