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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      banks: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      cashback_offers: {
        Row: {
          cashback_value: string
          category: string
          claim_instructions: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          store_name: string
          validity: string | null
        }
        Insert: {
          cashback_value: string
          category: string
          claim_instructions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          store_name: string
          validity?: string | null
        }
        Update: {
          cashback_value?: string
          category?: string
          claim_instructions?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          store_name?: string
          validity?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          service: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          service?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
        }
        Relationships: []
      }
      credit_cards: {
        Row: {
          annual_fee: number
          apply_link: string | null
          bank_name: string
          card_name: string
          card_type: string | null
          cashback_rate: string | null
          created_at: string
          features: string[] | null
          id: string
          is_active: boolean | null
          joining_fee: number
          min_age: number | null
          min_salary: number | null
          rating: number | null
          reward_points: string | null
          updated_at: string
          welcome_bonus: string | null
        }
        Insert: {
          annual_fee?: number
          apply_link?: string | null
          bank_name: string
          card_name: string
          card_type?: string | null
          cashback_rate?: string | null
          created_at?: string
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          joining_fee?: number
          min_age?: number | null
          min_salary?: number | null
          rating?: number | null
          reward_points?: string | null
          updated_at?: string
          welcome_bonus?: string | null
        }
        Update: {
          annual_fee?: number
          apply_link?: string | null
          bank_name?: string
          card_name?: string
          card_type?: string | null
          cashback_rate?: string | null
          created_at?: string
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          joining_fee?: number
          min_age?: number | null
          min_salary?: number | null
          rating?: number | null
          reward_points?: string | null
          updated_at?: string
          welcome_bonus?: string | null
        }
        Relationships: []
      }
      deal_clicks: {
        Row: {
          clicked_at: string | null
          deal_id: string
          device: string | null
          id: string
          ip_hash: string | null
          source_page: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string | null
          deal_id: string
          device?: string | null
          id?: string
          ip_hash?: string | null
          source_page?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string | null
          deal_id?: string
          device?: string | null
          id?: string
          ip_hash?: string | null
          source_page?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_clicks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "finance_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_deals: {
        Row: {
          ai_benefits: string | null
          ai_description: string | null
          ai_eligibility: string | null
          ai_terms: string | null
          cashback: string | null
          category: string
          clicks: number | null
          created_at: string | null
          deal_id: string
          description: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          merchant: string
          offer_type: string | null
          subcategory: string | null
          title: string
          tracking_link: string | null
        }
        Insert: {
          ai_benefits?: string | null
          ai_description?: string | null
          ai_eligibility?: string | null
          ai_terms?: string | null
          cashback?: string | null
          category?: string
          clicks?: number | null
          created_at?: string | null
          deal_id: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          merchant: string
          offer_type?: string | null
          subcategory?: string | null
          title: string
          tracking_link?: string | null
        }
        Update: {
          ai_benefits?: string | null
          ai_description?: string | null
          ai_eligibility?: string | null
          ai_terms?: string | null
          cashback?: string | null
          category?: string
          clicks?: number | null
          created_at?: string | null
          deal_id?: string
          description?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          merchant?: string
          offer_type?: string | null
          subcategory?: string | null
          title?: string
          tracking_link?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          bank_name: string | null
          city: string | null
          company: string | null
          created_at: string
          deal_id: string | null
          device: string | null
          email: string
          id: string
          ip_hash: string | null
          name: string
          notes: string | null
          phone: string | null
          product_name: string | null
          salary_range: string | null
          service: string | null
          source_page: string | null
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          bank_name?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          deal_id?: string | null
          device?: string | null
          email: string
          id?: string
          ip_hash?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          product_name?: string | null
          salary_range?: string | null
          service?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          bank_name?: string | null
          city?: string | null
          company?: string | null
          created_at?: string
          deal_id?: string | null
          device?: string | null
          email?: string
          id?: string
          ip_hash?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          product_name?: string | null
          salary_range?: string | null
          service?: string | null
          source_page?: string | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "finance_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_products: {
        Row: {
          apply_link: string | null
          bank_name: string
          created_at: string
          employment_type: string[] | null
          features: string[] | null
          id: string
          interest_rate: number
          is_active: boolean | null
          loan_name: string
          max_amount: number
          max_tenure: number | null
          min_age: number | null
          min_amount: number
          min_salary: number | null
          min_tenure: number | null
          processing_fee: string | null
          updated_at: string
        }
        Insert: {
          apply_link?: string | null
          bank_name: string
          created_at?: string
          employment_type?: string[] | null
          features?: string[] | null
          id?: string
          interest_rate: number
          is_active?: boolean | null
          loan_name: string
          max_amount?: number
          max_tenure?: number | null
          min_age?: number | null
          min_amount?: number
          min_salary?: number | null
          min_tenure?: number | null
          processing_fee?: string | null
          updated_at?: string
        }
        Update: {
          apply_link?: string | null
          bank_name?: string
          created_at?: string
          employment_type?: string[] | null
          features?: string[] | null
          id?: string
          interest_rate?: number
          is_active?: boolean | null
          loan_name?: string
          max_amount?: number
          max_tenure?: number | null
          min_age?: number | null
          min_amount?: number
          min_salary?: number | null
          min_tenure?: number | null
          processing_fee?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          category: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
        }
        Insert: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
        }
        Update: {
          alt_text?: string | null
          category?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          client: string
          created_at: string
          deadline: string | null
          description: string | null
          id: string
          name: string
          progress: number
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name: string
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client?: string
          created_at?: string
          deadline?: string | null
          description?: string | null
          id?: string
          name?: string
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
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
    Enums: {},
  },
} as const
