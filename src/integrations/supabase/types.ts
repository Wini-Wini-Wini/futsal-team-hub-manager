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
      announcements: {
        Row: {
          author: string
          created_at: string
          created_by: string
          date: string
          id: string
          message: string
          priority: string
          read: string[] | null
          title: string
          votes: Json | null
          voting: boolean | null
        }
        Insert: {
          author: string
          created_at?: string
          created_by: string
          date: string
          id?: string
          message: string
          priority: string
          read?: string[] | null
          title: string
          votes?: Json | null
          voting?: boolean | null
        }
        Update: {
          author?: string
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          message?: string
          priority?: string
          read?: string[] | null
          title?: string
          votes?: Json | null
          voting?: boolean | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          comment: string
          created_at: string
          id: string
          rating: number | null
          target_id: string
          target_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          rating?: number | null
          target_id: string
          target_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          rating?: number | null
          target_id?: string
          target_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          away_score: number | null
          away_team_logo: string | null
          created_at: string
          created_by: string
          date: string
          home_score: number | null
          home_team_logo: string | null
          id: string
          location: string
          opponent: string | null
          time: string
          uniform: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_logo?: string | null
          created_at?: string
          created_by: string
          date: string
          home_score?: number | null
          home_team_logo?: string | null
          id?: string
          location: string
          opponent?: string | null
          time: string
          uniform?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_logo?: string | null
          created_at?: string
          created_by?: string
          date?: string
          home_score?: number | null
          home_team_logo?: string | null
          id?: string
          location?: string
          opponent?: string | null
          time?: string
          uniform?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          media_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          media_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          media_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      trainings: {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: string
          location: string
          time: string
          uniform: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          date: string
          id?: string
          location: string
          time: string
          uniform?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: string
          location?: string
          time?: string
          uniform?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
