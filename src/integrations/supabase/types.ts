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
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_on: string | null
          category: string | null
          created_at: string
          description: string | null
          external_url: string | null
          extra: Json
          file_name: string | null
          file_url: string | null
          id: string
          image_url: string | null
          organization: string | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          achieved_on?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          extra?: Json
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          organization?: string | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          achieved_on?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          external_url?: string | null
          extra?: Json
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          organization?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          description: string | null
          earned: boolean
          extra: Json
          icon: string | null
          id: string
          published: boolean
          sort_order: number
          tier: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          earned?: boolean
          extra?: Json
          icon?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          tier?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          earned?: boolean
          extra?: Json
          icon?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          tier?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          extra: Json
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          image_url: string | null
          issue_date: string | null
          organization: string | null
          published: boolean
          skills: string[]
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          extra?: Json
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          organization?: string | null
          published?: boolean
          skills?: string[]
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          extra?: Json
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          organization?: string | null
          published?: boolean
          skills?: string[]
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          extra: Json
          file_name: string | null
          file_type: string | null
          file_url: string | null
          id: string
          is_primary: boolean
          kind: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          extra?: Json
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_primary?: boolean
          kind?: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          extra?: Json
          file_name?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_primary?: boolean
          kind?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          achievements: string[]
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          extra: Json
          field: string | null
          file_name: string | null
          file_url: string | null
          id: string
          image_url: string | null
          institution: string
          published: boolean
          score: string | null
          sort_order: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          extra?: Json
          field?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          institution: string
          published?: boolean
          score?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          extra?: Json
          field?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          image_url?: string | null
          institution?: string
          published?: boolean
          score?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      highlights: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          published: boolean
          section: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          section?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          published?: boolean
          section?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          alt_text: string | null
          bucket: string
          category: string
          created_at: string
          extra: Json
          file_name: string
          file_size: number | null
          id: string
          kind: string
          mime_type: string | null
          path: string
          updated_at: string
          url: string | null
        }
        Insert: {
          alt_text?: string | null
          bucket?: string
          category?: string
          created_at?: string
          extra?: Json
          file_name: string
          file_size?: number | null
          id?: string
          kind?: string
          mime_type?: string | null
          path: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          alt_text?: string | null
          bucket?: string
          category?: string
          created_at?: string
          extra?: Json
          file_name?: string
          file_size?: number | null
          id?: string
          kind?: string
          mime_type?: string | null
          path?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          message: string
          name: string
          read: boolean
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          message: string
          name: string
          read?: boolean
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          message?: string
          name?: string
          read?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          extra: Json
          full_name: string
          goals: string[]
          hero_media_url: string | null
          id: string
          interests: string[]
          intro: string | null
          level_label: string | null
          location: string | null
          phone: string | null
          published: boolean
          tagline: string | null
          title: string
          updated_at: string
          xp_override: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          extra?: Json
          full_name?: string
          goals?: string[]
          hero_media_url?: string | null
          id?: string
          interests?: string[]
          intro?: string | null
          level_label?: string | null
          location?: string | null
          phone?: string | null
          published?: boolean
          tagline?: string | null
          title?: string
          updated_at?: string
          xp_override?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          extra?: Json
          full_name?: string
          goals?: string[]
          hero_media_url?: string | null
          id?: string
          interests?: string[]
          intro?: string | null
          level_label?: string | null
          location?: string | null
          phone?: string | null
          published?: boolean
          tagline?: string | null
          title?: string
          updated_at?: string
          xp_override?: number | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          extra: Json
          featured: boolean
          file_name: string | null
          file_url: string | null
          github_url: string | null
          id: string
          images: string[]
          live_url: string | null
          published: boolean
          sort_order: number
          status: string | null
          summary: string | null
          technologies: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          extra?: Json
          featured?: boolean
          file_name?: string | null
          file_url?: string | null
          github_url?: string | null
          id?: string
          images?: string[]
          live_url?: string | null
          published?: boolean
          sort_order?: number
          status?: string | null
          summary?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          extra?: Json
          featured?: boolean
          file_name?: string | null
          file_url?: string | null
          github_url?: string | null
          id?: string
          images?: string[]
          live_url?: string | null
          published?: boolean
          sort_order?: number
          status?: string | null
          summary?: string | null
          technologies?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent: string
          created_at: string
          enable_3d: boolean
          enable_particles: boolean
          extra: Json
          id: string
          show_contact_form: boolean
          site_description: string | null
          site_title: string
          updated_at: string
        }
        Insert: {
          accent?: string
          created_at?: string
          enable_3d?: boolean
          enable_particles?: boolean
          extra?: Json
          id?: string
          show_contact_form?: boolean
          site_description?: string | null
          site_title?: string
          updated_at?: string
        }
        Update: {
          accent?: string
          created_at?: string
          enable_3d?: boolean
          enable_particles?: boolean
          extra?: Json
          id?: string
          show_contact_form?: boolean
          site_description?: string | null
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          extra: Json
          icon: string | null
          id: string
          level: number
          name: string
          published: boolean
          related_projects: string[]
          sort_order: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          extra?: Json
          icon?: string | null
          id?: string
          level?: number
          name: string
          published?: boolean
          related_projects?: string[]
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          extra?: Json
          icon?: string | null
          id?: string
          level?: number
          name?: string
          published?: boolean
          related_projects?: string[]
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          extra: Json
          icon: string | null
          id: string
          label: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          extra?: Json
          icon?: string | null
          id?: string
          label: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          extra?: Json
          icon?: string | null
          id?: string
          label?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "owner"
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
      app_role: ["owner"],
    },
  },
} as const
