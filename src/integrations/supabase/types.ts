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
      chapters: {
        Row: {
          chapter_number: number
          created_at: string | null
          description: string | null
          english_title: string | null
          id: string
          sanskrit_title: string | null
          sort_order: number | null
          summary: string | null
          title: string
          total_verses: number | null
          updated_at: string | null
          visibility: Database["public"]["Enums"]["visibility_status"] | null
        }
        Insert: {
          chapter_number: number
          created_at?: string | null
          description?: string | null
          english_title?: string | null
          id?: string
          sanskrit_title?: string | null
          sort_order?: number | null
          summary?: string | null
          title: string
          total_verses?: number | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_status"] | null
        }
        Update: {
          chapter_number?: number
          created_at?: string | null
          description?: string | null
          english_title?: string | null
          id?: string
          sanskrit_title?: string | null
          sort_order?: number | null
          summary?: string | null
          title?: string
          total_verses?: number | null
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["visibility_status"] | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          manual_chapter_count: number | null
          manual_verse_count: number | null
          name: string
          native_name: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manual_chapter_count?: number | null
          manual_verse_count?: number | null
          name: string
          native_name?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          manual_chapter_count?: number | null
          manual_verse_count?: number | null
          name?: string
          native_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      verses: {
        Row: {
          chapter_id: string
          commentary: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          english_translation: string | null
          id: string
          is_daily_verse: boolean | null
          keywords: string[] | null
          language_id: string
          sanskrit_text: string | null
          status: Database["public"]["Enums"]["verse_status"] | null
          title: string | null
          transliteration: string | null
          updated_at: string | null
          verse_number: number
          video_file_path: string | null
          visibility: Database["public"]["Enums"]["visibility_status"] | null
          whatsapp_share_text: string | null
          youtube_url: string | null
        }
        Insert: {
          chapter_id: string
          commentary?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          english_translation?: string | null
          id?: string
          is_daily_verse?: boolean | null
          keywords?: string[] | null
          language_id: string
          sanskrit_text?: string | null
          status?: Database["public"]["Enums"]["verse_status"] | null
          title?: string | null
          transliteration?: string | null
          updated_at?: string | null
          verse_number: number
          video_file_path?: string | null
          visibility?: Database["public"]["Enums"]["visibility_status"] | null
          whatsapp_share_text?: string | null
          youtube_url?: string | null
        }
        Update: {
          chapter_id?: string
          commentary?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          english_translation?: string | null
          id?: string
          is_daily_verse?: boolean | null
          keywords?: string[] | null
          language_id?: string
          sanskrit_text?: string | null
          status?: Database["public"]["Enums"]["verse_status"] | null
          title?: string | null
          transliteration?: string | null
          updated_at?: string | null
          verse_number?: number
          video_file_path?: string | null
          visibility?: Database["public"]["Enums"]["visibility_status"] | null
          whatsapp_share_text?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verses_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_edit: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "editor" | "viewer"
      verse_status: "pending" | "uploaded" | "processing" | "published"
      visibility_status: "published" | "hidden" | "draft"
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
      user_role: ["admin", "editor", "viewer"],
      verse_status: ["pending", "uploaded", "processing", "published"],
      visibility_status: ["published", "hidden", "draft"],
    },
  },
} as const
