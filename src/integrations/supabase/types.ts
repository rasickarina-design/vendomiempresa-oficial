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
      buyers: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          country: string | null
          created_at: string
          currency: string
          email: string
          id: string
          linkedin: string | null
          location_pref: string | null
          name: string | null
          phone: string | null
          role: string | null
          sectors: string
          thesis: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          country?: string | null
          created_at?: string
          currency?: string
          email: string
          id?: string
          linkedin?: string | null
          location_pref?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          sectors: string
          thesis?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          country?: string | null
          created_at?: string
          currency?: string
          email?: string
          id?: string
          linkedin?: string | null
          location_pref?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          sectors?: string
          thesis?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          age: string | null
          city: string | null
          country: string | null
          created_at: string
          description: string
          financials_url: string | null
          google_profile: string | null
          id: string
          linkedin: string | null
          location: string | null
          maps_url: string | null
          name: string
          owner_email: string
          owner_name: string | null
          owner_phone: string | null
          owner_position: string | null
          postal_code: string | null
          price_amount: number | null
          price_currency: string
          revenue: string | null
          sector: string
          share_ref: string | null
        }
        Insert: {
          age?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description: string
          financials_url?: string | null
          google_profile?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          maps_url?: string | null
          name: string
          owner_email: string
          owner_name?: string | null
          owner_phone?: string | null
          owner_position?: string | null
          postal_code?: string | null
          price_amount?: number | null
          price_currency?: string
          revenue?: string | null
          sector: string
          share_ref?: string | null
        }
        Update: {
          age?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          description?: string
          financials_url?: string | null
          google_profile?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          maps_url?: string | null
          name?: string
          owner_email?: string
          owner_name?: string | null
          owner_phone?: string | null
          owner_position?: string | null
          postal_code?: string | null
          price_amount?: number | null
          price_currency?: string
          revenue?: string | null
          sector?: string
          share_ref?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          buyer_email: string
          company_name: string | null
          company_ref: string | null
          created_at: string
          direction: string | null
          id: string
        }
        Insert: {
          buyer_email: string
          company_name?: string | null
          company_ref?: string | null
          created_at?: string
          direction?: string | null
          id?: string
        }
        Update: {
          buyer_email?: string
          company_name?: string | null
          company_ref?: string | null
          created_at?: string
          direction?: string | null
          id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_company: {
        Args: { _ref: string }
        Returns: {
          age: string
          city: string
          country: string
          description: string
          maps_url: string
          name: string
          owner_position: string
          price_amount: number
          price_currency: string
          revenue: string
          sector: string
          share_ref: string
        }[]
      }
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
      app_role: ["admin", "user"],
    },
  },
} as const
