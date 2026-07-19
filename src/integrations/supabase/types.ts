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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          city: string | null
          content: string
          created_at: string
          excerpt: string
          featured_image: string
          id: string
          meta_description: string
          meta_title: string | null
          read_time: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          city?: string | null
          content: string
          created_at?: string
          excerpt?: string
          featured_image?: string
          id?: string
          meta_description?: string
          meta_title?: string | null
          read_time?: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          city?: string | null
          content?: string
          created_at?: string
          excerpt?: string
          featured_image?: string
          id?: string
          meta_description?: string
          meta_title?: string | null
          read_time?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          business_type: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
        }
        Insert: {
          business_type?: string | null
          city?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
        }
        Update: {
          business_type?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
        }
        Relationships: []
      }
      contractor_waitlist: {
        Row: {
          city: string
          created_at: string
          email: string
          id: string
          name: string
          trade: string | null
        }
        Insert: {
          city: string
          created_at?: string
          email: string
          id?: string
          name: string
          trade?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          trade?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          source: string
          trade: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          source?: string
          trade?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          source?: string
          trade?: string | null
        }
        Relationships: []
      }
      generated_posts: {
        Row: {
          body_html: string
          category: string
          city: string
          created_at: string
          excerpt: string
          hero_alt: string | null
          hero_image_url: string | null
          hero_prompt_id: string | null
          id: string
          meta_description: string
          meta_title: string
          process_alt: string | null
          process_image_url: string | null
          process_prompt_id: string | null
          published_post_id: string | null
          slug: string
          status: string
          title: string
          trade: string
          trust_alt: string | null
          trust_image_url: string | null
          trust_prompt_id: string | null
          updated_at: string
        }
        Insert: {
          body_html?: string
          category?: string
          city: string
          created_at?: string
          excerpt?: string
          hero_alt?: string | null
          hero_image_url?: string | null
          hero_prompt_id?: string | null
          id?: string
          meta_description?: string
          meta_title?: string
          process_alt?: string | null
          process_image_url?: string | null
          process_prompt_id?: string | null
          published_post_id?: string | null
          slug?: string
          status?: string
          title?: string
          trade: string
          trust_alt?: string | null
          trust_image_url?: string | null
          trust_prompt_id?: string | null
          updated_at?: string
        }
        Update: {
          body_html?: string
          category?: string
          city?: string
          created_at?: string
          excerpt?: string
          hero_alt?: string | null
          hero_image_url?: string | null
          hero_prompt_id?: string | null
          id?: string
          meta_description?: string
          meta_title?: string
          process_alt?: string | null
          process_image_url?: string | null
          process_prompt_id?: string | null
          published_post_id?: string | null
          slug?: string
          status?: string
          title?: string
          trade?: string
          trust_alt?: string | null
          trust_image_url?: string | null
          trust_prompt_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_posts_hero_prompt_id_fkey"
            columns: ["hero_prompt_id"]
            isOneToOne: false
            referencedRelation: "image_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_posts_process_prompt_id_fkey"
            columns: ["process_prompt_id"]
            isOneToOne: false
            referencedRelation: "image_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_posts_trust_prompt_id_fkey"
            columns: ["trust_prompt_id"]
            isOneToOne: false
            referencedRelation: "image_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      image_prompts: {
        Row: {
          alt_text_template: string
          aspect_ratio: string
          category: Database["public"]["Enums"]["image_prompt_category"]
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          trade: string
          updated_at: string
          visual_description: string
        }
        Insert: {
          alt_text_template: string
          aspect_ratio?: string
          category: Database["public"]["Enums"]["image_prompt_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          trade: string
          updated_at?: string
          visual_description: string
        }
        Update: {
          alt_text_template?: string
          aspect_ratio?: string
          category?: Database["public"]["Enums"]["image_prompt_category"]
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          trade?: string
          updated_at?: string
          visual_description?: string
        }
        Relationships: []
      }
      industry_calculator_leads: {
        Row: {
          base_high: number
          base_low: number
          created_at: string
          email: string | null
          estimate_high: number
          estimate_low: number
          id: string
          modifier: number
          name: string | null
          notes: string | null
          phone: string | null
          region_tier: string
          selections: Json
          trade: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          base_high: number
          base_low: number
          created_at?: string
          email?: string | null
          estimate_high: number
          estimate_low: number
          id?: string
          modifier: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          region_tier: string
          selections?: Json
          trade: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          base_high?: number
          base_low?: number
          created_at?: string
          email?: string | null
          estimate_high?: number
          estimate_low?: number
          id?: string
          modifier?: number
          name?: string | null
          notes?: string | null
          phone?: string | null
          region_tier?: string
          selections?: Json
          trade?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      programmatic_calculator_leads: {
        Row: {
          area_sqft: number | null
          board_feet: number | null
          created_at: string
          email: string
          estimate_high: number | null
          estimate_low: number | null
          full_name: string
          id: string
          industry: string
          modifier: number | null
          phone: string
          project_type: string | null
          region_tier: string | null
          thickness_inches: number | null
          zip_code: string
        }
        Insert: {
          area_sqft?: number | null
          board_feet?: number | null
          created_at?: string
          email: string
          estimate_high?: number | null
          estimate_low?: number | null
          full_name: string
          id?: string
          industry: string
          modifier?: number | null
          phone: string
          project_type?: string | null
          region_tier?: string | null
          thickness_inches?: number | null
          zip_code: string
        }
        Update: {
          area_sqft?: number | null
          board_feet?: number | null
          created_at?: string
          email?: string
          estimate_high?: number | null
          estimate_low?: number | null
          full_name?: string
          id?: string
          industry?: string
          modifier?: number | null
          phone?: string
          project_type?: string | null
          region_tier?: string | null
          thickness_inches?: number | null
          zip_code?: string
        }
        Relationships: []
      }
      service_location_faqs: {
        Row: {
          county_slug: string | null
          created_at: string
          faqs: Json
          id: string
          service_slug: string
          state_slug: string | null
          updated_at: string
        }
        Insert: {
          county_slug?: string | null
          created_at?: string
          faqs?: Json
          id?: string
          service_slug: string
          state_slug?: string | null
          updated_at?: string
        }
        Update: {
          county_slug?: string | null
          created_at?: string
          faqs?: Json
          id?: string
          service_slug?: string
          state_slug?: string | null
          updated_at?: string
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
      image_prompt_category: "hero" | "process" | "trust"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      image_prompt_category: ["hero", "process", "trust"],
    },
  },
} as const
