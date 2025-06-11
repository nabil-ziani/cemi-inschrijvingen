export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      class: {
        Row: {
          class_time: Database["public"]["Enums"]["classtime"]
          class_type: Database["public"]["Enums"]["classtype"]
          classid: string
          gender: Database["public"]["Enums"]["gender"]
          levelid: string
          naam: string
          year: number | null
        }
        Insert: {
          class_time: Database["public"]["Enums"]["classtime"]
          class_type: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender: Database["public"]["Enums"]["gender"]
          levelid: string
          naam: string
          year?: number | null
        }
        Update: {
          class_time?: Database["public"]["Enums"]["classtime"]
          class_type?: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender?: Database["public"]["Enums"]["gender"]
          levelid?: string
          naam?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_levelid_fkey"
            columns: ["levelid"]
            isOneToOne: false
            referencedRelation: "level"
            referencedColumns: ["levelid"]
          },
        ]
      }
      enrollment: {
        Row: {
          classid: string | null
          completed: boolean | null
          enrolled_by: string | null
          enrollmentid: string
          levelid: string | null
          passed: boolean | null
          payment_amount: number | null
          payment_complete: boolean | null
          status: Database["public"]["Enums"]["newenrollmentstatus"]
          studentid: string
          type: Database["public"]["Enums"]["classtype"] | null
          year: number
        }
        Insert: {
          classid?: string | null
          completed?: boolean | null
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number | null
          payment_complete?: boolean | null
          status: Database["public"]["Enums"]["newenrollmentstatus"]
          studentid: string
          type?: Database["public"]["Enums"]["classtype"] | null
          year: number
        }
        Update: {
          classid?: string | null
          completed?: boolean | null
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number | null
          payment_complete?: boolean | null
          status?: Database["public"]["Enums"]["newenrollmentstatus"]
          studentid?: string
          type?: Database["public"]["Enums"]["classtype"] | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_classid_fkey"
            columns: ["classid"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["classid"]
          },
          {
            foreignKeyName: "enrollment_levelid_fkey"
            columns: ["levelid"]
            isOneToOne: false
            referencedRelation: "level"
            referencedColumns: ["levelid"]
          },
          {
            foreignKeyName: "enrollment_studentid_fkey"
            columns: ["studentid"]
            isOneToOne: false
            referencedRelation: "student"
            referencedColumns: ["studentid"]
          },
        ]
      }
      level: {
        Row: {
          levelid: string
          name: Database["public"]["Enums"]["leveltype"]
        }
        Insert: {
          levelid?: string
          name: Database["public"]["Enums"]["leveltype"]
        }
        Update: {
          levelid?: string
          name?: Database["public"]["Enums"]["leveltype"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string
          id: string
          name: string | null
        }
        Insert: {
          email?: string
          id: string
          name?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      student: {
        Row: {
          birthdate: string | null
          city: string | null
          email_1: string
          email_2: string | null
          firstname: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone: boolean | null
          housenumber: string | null
          lastname: string
          phone_1: string
          phone_2: string | null
          postalcode: string | null
          remarks: string | null
          repeating_year: boolean | null
          street: string | null
          studentid: string
        }
        Insert: {
          birthdate?: string | null
          city?: string | null
          email_1: string
          email_2?: string | null
          firstname: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone?: boolean | null
          housenumber?: string | null
          lastname: string
          phone_1: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string | null
          repeating_year?: boolean | null
          street?: string | null
          studentid?: string
        }
        Update: {
          birthdate?: string | null
          city?: string | null
          email_1?: string
          email_2?: string | null
          firstname?: string
          gender?: Database["public"]["Enums"]["gender"]
          homeAlone?: boolean | null
          housenumber?: string | null
          lastname?: string
          phone_1?: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string | null
          repeating_year?: boolean | null
          street?: string | null
          studentid?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      classtime: "VM" | "MD" | "NM"
      classtype: "Woensdag" | "Zondag" | "Weekend"
      gender: "m" | "f"
      leveltype:
        | "Tamhiedi"
        | "Niveau 1"
        | "Niveau 2"
        | "Niveau 3 - deel 1"
        | "Niveau 3 - deel 2"
        | "Niveau 4 - deel 1"
        | "Niveau 4 - deel 2"
        | "Niveau 5"
        | "Vervolg Niveau 5 - deel 1"
      newenrollmentstatus:
        | "Ingeschreven"
        | "Uitgeschreven"
        | "Onder voorbehoud"
        | "Niet heringeschreven"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      classtime: ["VM", "MD", "NM"],
      classtype: ["Woensdag", "Zondag", "Weekend"],
      gender: ["m", "f"],
      leveltype: [
        "Tamhiedi",
        "Niveau 1",
        "Niveau 2",
        "Niveau 3 - deel 1",
        "Niveau 3 - deel 2",
        "Niveau 4 - deel 1",
        "Niveau 4 - deel 2",
        "Niveau 5",
        "Vervolg Niveau 5 - deel 1",
      ],
      newenrollmentstatus: [
        "Ingeschreven",
        "Uitgeschreven",
        "Onder voorbehoud",
        "Niet heringeschreven",
      ],
    },
  },
} as const
