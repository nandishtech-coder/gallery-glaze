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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_login_otps: {
        Row: {
          attempts: number
          code_hash: string
          created_at: string
          expires_at: string
          id: string
          session_id: string
          user_id: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          code_hash: string
          created_at?: string
          expires_at: string
          id?: string
          session_id: string
          user_id: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          code_hash?: string
          created_at?: string
          expires_at?: string
          id?: string
          session_id?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          approved: boolean
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          id: string
          user_id: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          id?: string
          user_id: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          github_url: string | null
          id: string
          live_enabled: boolean
          live_url: string | null
          name: string
          offer_discount_percent: number
          offer_enabled: boolean
          offer_ends_at: string | null
          offer_label: string
          project_type: string
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          live_enabled?: boolean
          live_url?: string | null
          name: string
          offer_discount_percent?: number
          offer_enabled?: boolean
          offer_ends_at?: string | null
          offer_label?: string
          project_type?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          github_url?: string | null
          id?: string
          live_enabled?: boolean
          live_url?: string | null
          name?: string
          offer_discount_percent?: number
          offer_enabled?: boolean
          offer_ends_at?: string | null
          offer_label?: string
          project_type?: string
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_label: string
          description: string
          discount_percent: number
          features: string[]
          id: string
          popular: boolean
          price: string
          price_suffix: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string
          description?: string
          discount_percent?: number
          features?: string[]
          id?: string
          popular?: boolean
          price?: string
          price_suffix?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string
          description?: string
          discount_percent?: number
          features?: string[]
          id?: string
          popular?: boolean
          price?: string
          price_suffix?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_stats: {
        Row: {
          created_at: string
          heading: string
          hero_stat1_label: string
          hero_stat1_value: string
          hero_stat2_label: string
          hero_stat2_value: string
          hero_stat3_label: string
          hero_stat3_value: string
          hero_stat4_label: string
          hero_stat4_value: string
          id: string
          projects_count: string
          projects_label: string
          subheading: string
          success_label: string
          success_rate: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          heading?: string
          hero_stat1_label?: string
          hero_stat1_value?: string
          hero_stat2_label?: string
          hero_stat2_value?: string
          hero_stat3_label?: string
          hero_stat3_value?: string
          hero_stat4_label?: string
          hero_stat4_value?: string
          id?: string
          projects_count?: string
          projects_label?: string
          subheading?: string
          success_label?: string
          success_rate?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          heading?: string
          hero_stat1_label?: string
          hero_stat1_value?: string
          hero_stat2_label?: string
          hero_stat2_value?: string
          hero_stat3_label?: string
          hero_stat3_value?: string
          hero_stat4_label?: string
          hero_stat4_value?: string
          id?: string
          projects_count?: string
          projects_label?: string
          subheading?: string
          success_label?: string
          success_rate?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          approved: boolean
          company: string | null
          created_at: string
          email: string | null
          id: string
          message: string
          name: string
          rating: number
          role: string | null
          updated_at: string
        }
        Insert: {
          approved?: boolean
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name: string
          rating?: number
          role?: string | null
          updated_at?: string
        }
        Update: {
          approved?: boolean
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string
          rating?: number
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          live_enabled: boolean | null
          live_url: string | null
          name: string | null
          offer_discount_percent: number | null
          offer_enabled: boolean | null
          offer_ends_at: string | null
          offer_label: string | null
          project_type: string | null
          thumbnail_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          live_enabled?: boolean | null
          live_url?: never
          name?: string | null
          offer_discount_percent?: number | null
          offer_enabled?: boolean | null
          offer_ends_at?: string | null
          offer_label?: string | null
          project_type?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          live_enabled?: boolean | null
          live_url?: never
          name?: string | null
          offer_discount_percent?: number | null
          offer_enabled?: boolean | null
          offer_ends_at?: string | null
          offer_label?: string | null
          project_type?: string | null
          thumbnail_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
