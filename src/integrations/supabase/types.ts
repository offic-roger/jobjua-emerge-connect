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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_regions: {
        Row: {
          agent_id: string
          assigned_at: string | null
          assigned_by: string
          id: string
          region_name: string
        }
        Insert: {
          agent_id: string
          assigned_at?: string | null
          assigned_by: string
          id?: string
          region_name: string
        }
        Update: {
          agent_id?: string
          assigned_at?: string | null
          assigned_by?: string
          id?: string
          region_name?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applied_at: string | null
          cover_letter: string | null
          id: string
          job_id: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_at?: string | null
          cover_letter?: string | null
          id?: string
          job_id?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          application_count: number | null
          approved_by: string | null
          benefits: string[] | null
          category: Database["public"]["Enums"]["job_category"]
          company_logo_url: string | null
          company_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          location: string
          posted_by: string
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          application_count?: number | null
          approved_by?: string | null
          benefits?: string[] | null
          category?: Database["public"]["Enums"]["job_category"]
          company_logo_url?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          location: string
          posted_by: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          application_count?: number | null
          approved_by?: string | null
          benefits?: string[] | null
          category?: Database["public"]["Enums"]["job_category"]
          company_logo_url?: string | null
          company_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          location?: string
          posted_by?: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          is_suspended: boolean | null
          is_vip: boolean | null
          phone_number: string | null
          suspension_reason: string | null
          updated_at: string | null
          user_id: string
          vip_expires_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean | null
          is_vip?: boolean | null
          phone_number?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id: string
          vip_expires_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean | null
          is_vip?: boolean | null
          phone_number?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string
          vip_expires_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vip_content: {
        Row: {
          content: string
          content_type: string
          created_at: string | null
          created_by: string
          id: string
          image_url: string | null
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string | null
          created_by: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string | null
          created_by?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vip_subscriptions: {
        Row: {
          amount: number
          approved_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference: string | null
          plan_name: string
          starts_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          plan_name: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          plan_name?: string
          starts_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
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
      app_role: "admin" | "agent" | "user"
      job_category: "normal" | "vip" | "quick_gig" | "verified"
      job_status: "draft" | "pending" | "approved" | "rejected" | "expired"
      payment_method: "vodacom" | "tigo" | "halotel" | "airtel" | "mpesa"
      payment_status: "pending" | "approved" | "rejected" | "failed"
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
      app_role: ["admin", "agent", "user"],
      job_category: ["normal", "vip", "quick_gig", "verified"],
      job_status: ["draft", "pending", "approved", "rejected", "expired"],
      payment_method: ["vodacom", "tigo", "halotel", "airtel", "mpesa"],
      payment_status: ["pending", "approved", "rejected", "failed"],
    },
  },
} as const
