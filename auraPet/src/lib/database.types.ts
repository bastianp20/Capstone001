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
      citas: {
        Row: {
          cancelada_por: string | null
          centro_id: number
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
          centro_id: number
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
          centro_id?: number
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
      perfiles: {
        Row: {
          avatar_url: string | null
          creado_en: string
          desactivado_en: string | null
          id: string
          nombre: string
          rol: Database["public"]["Enums"]["rol_usuario"]
          telefono: number | null
        }
        Insert: {
          avatar_url?: string | null
          creado_en?: string
          desactivado_en?: string | null
          id: string
          nombre: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: number | null
        }
        Update: {
          avatar_url?: string | null
          creado_en?: string
          desactivado_en?: string | null
          id?: string
          nombre?: string
          rol?: Database["public"]["Enums"]["rol_usuario"]
          telefono?: number | null
        }
        Relationships: []
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
          creado_en: string
          especialidad_id: number | null
          estado_verificacion: Database["public"]["Enums"]["estado_verificacion"]
          id: number
          motivo_rechazo: string | null
          numero_colegiado: string | null
          perfil_id: string | null
          revisado_en: string | null
          revisado_por: string | null
        }
        Insert: {
          creado_en?: string
          especialidad_id?: number | null
          estado_verificacion?: Database["public"]["Enums"]["estado_verificacion"]
          id?: never
          motivo_rechazo?: string | null
          numero_colegiado?: string | null
          perfil_id?: string | null
          revisado_en?: string | null
          revisado_por?: string | null
        }
        Update: {
          creado_en?: string
          especialidad_id?: number | null
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
      es_admin_de_centro: { Args: { p_centro_id: number }; Returns: boolean }
      es_superadmin: { Args: never; Returns: boolean }
      es_veterinario_de_centro: {
        Args: { p_centro_id: number }
        Returns: boolean
      }
      mi_veterinario_id: { Args: never; Returns: number }
      preguntas_frecuentes: {
        Args: { limite?: number }
        Returns: {
          cantidad: number
          pregunta: string
          respuesta: string
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
      estado_verificacion: "pendiente" | "aprobado" | "rechazado"
      rol_usuario: "dueno" | "veterinario" | "superadmin"
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
      estado_verificacion: ["pendiente", "aprobado", "rechazado"],
      rol_usuario: ["dueno", "veterinario", "superadmin"],
      sexo_mascota: ["macho", "hembra"],
      tipo_registro: ["diagnostico", "vacuna", "cirugia", "control", "otro"],
      urgencia_cita: ["baja", "media", "alta", "critica"],
    },
  },
} as const
