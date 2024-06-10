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
          year: number
        }
        Insert: {
          class_time: Database["public"]["Enums"]["classtime"]
          class_type: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender: Database["public"]["Enums"]["gender"]
          levelid: string
          naam: string
          year?: number
        }
        Update: {
          class_time?: Database["public"]["Enums"]["classtime"]
          class_type?: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender?: Database["public"]["Enums"]["gender"]
          levelid?: string
          naam?: string
          year?: number
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
      class_duplicate: {
        Row: {
          class_time: Database["public"]["Enums"]["classtime"]
          class_type: Database["public"]["Enums"]["classtype"]
          classid: string
          gender: Database["public"]["Enums"]["gender"]
          levelid: string
          naam: string
          year: number
        }
        Insert: {
          class_time: Database["public"]["Enums"]["classtime"]
          class_type: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender: Database["public"]["Enums"]["gender"]
          levelid: string
          naam: string
          year?: number
        }
        Update: {
          class_time?: Database["public"]["Enums"]["classtime"]
          class_type?: Database["public"]["Enums"]["classtype"]
          classid?: string
          gender?: Database["public"]["Enums"]["gender"]
          levelid?: string
          naam?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_duplicate_levelid_fkey"
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
          completed: boolean
          enrolled_by: string | null
          enrollmentid: string
          levelid: string | null
          passed: boolean | null
          payment_amount: number
          payment_complete: boolean
          status: Database["public"]["Enums"]["enrollmentstatus"]
          studentid: string
          year: number
        }
        Insert: {
          classid?: string | null
          completed?: boolean
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number
          payment_complete?: boolean
          status?: Database["public"]["Enums"]["enrollmentstatus"]
          studentid: string
          year: number
        }
        Update: {
          classid?: string | null
          completed?: boolean
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number
          payment_complete?: boolean
          status?: Database["public"]["Enums"]["enrollmentstatus"]
          studentid?: string
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
      enrollment_duplicate: {
        Row: {
          classid: string | null
          completed: boolean
          enrolled_by: string | null
          enrollmentid: string
          levelid: string | null
          passed: boolean | null
          payment_amount: number
          payment_complete: boolean
          status: Database["public"]["Enums"]["enrollmentstatus"]
          studentid: string
          year: number
        }
        Insert: {
          classid?: string | null
          completed?: boolean
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number
          payment_complete?: boolean
          status?: Database["public"]["Enums"]["enrollmentstatus"]
          studentid: string
          year: number
        }
        Update: {
          classid?: string | null
          completed?: boolean
          enrolled_by?: string | null
          enrollmentid?: string
          levelid?: string | null
          passed?: boolean | null
          payment_amount?: number
          payment_complete?: boolean
          status?: Database["public"]["Enums"]["enrollmentstatus"]
          studentid?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_duplicate_classid_fkey"
            columns: ["classid"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["classid"]
          },
          {
            foreignKeyName: "enrollment_duplicate_levelid_fkey"
            columns: ["levelid"]
            isOneToOne: false
            referencedRelation: "level"
            referencedColumns: ["levelid"]
          },
          {
            foreignKeyName: "enrollment_duplicate_studentid_fkey"
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
      level_duplicate: {
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
      student: {
        Row: {
          birthdate: string | null
          city: string | null
          email_1: string
          email_2: string | null
          firstname: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone: boolean
          housenumber: string | null
          lastname: string
          phone_1: string
          phone_2: string | null
          postalcode: string | null
          remarks: string
          street: string | null
          studentid: string
        }
        Insert: {
          birthdate?: string | null
          city?: string | null
          email_1?: string
          email_2?: string | null
          firstname?: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone?: boolean
          housenumber?: string | null
          lastname?: string
          phone_1?: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string
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
          homeAlone?: boolean
          housenumber?: string | null
          lastname?: string
          phone_1?: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string
          street?: string | null
          studentid?: string
        }
        Relationships: []
      }
      student_duplicate: {
        Row: {
          birthdate: string | null
          city: string | null
          email_1: string
          email_2: string | null
          firstname: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone: boolean
          housenumber: string | null
          lastname: string
          phone_1: string
          phone_2: string | null
          postalcode: string | null
          remarks: string
          street: string | null
          studentid: string
        }
        Insert: {
          birthdate?: string | null
          city?: string | null
          email_1?: string
          email_2?: string | null
          firstname?: string
          gender: Database["public"]["Enums"]["gender"]
          homeAlone?: boolean
          housenumber?: string | null
          lastname?: string
          phone_1?: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string
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
          homeAlone?: boolean
          housenumber?: string | null
          lastname?: string
          phone_1?: string
          phone_2?: string | null
          postalcode?: string | null
          remarks?: string
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
      enrollment_status:
        | "Heringeschreven"
        | "Niet ingeschreven"
        | "Onder voorbehoud"
      enrollmentstatus:
        | "Heringeschreven"
        | "Niet ingeschreven"
        | "Onder voorbehoud"
      gender: "m" | "f"
      leveltype:
        | "Tamhiedi"
        | "Niveau 1"
        | "Niveau 2"
        | "Niveau 3 - deel 1"
        | "Niveau 3 - deel 2"
        | "Niveau 4 - deel 1"
        | "Niveau 4 - deel 2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
