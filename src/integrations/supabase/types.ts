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
      addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          neighborhood: string | null
          number: string
          state: string
          street: string
          title: string | null
          updated_at: string | null
          user_id: string
          zip_code: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          neighborhood?: string | null
          number: string
          state: string
          street: string
          title?: string | null
          updated_at?: string | null
          user_id: string
          zip_code: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          neighborhood?: string | null
          number?: string
          state?: string
          street?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      affiliate_clicks: {
        Row: {
          affiliate_id: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          affiliate_id?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          pix_key: string | null
          referral_code: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          pix_key?: string | null
          referral_code: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          pix_key?: string | null
          referral_code?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_configurations: {
        Row: {
          created_at: string
          id: string
          model_name: string | null
          model_provider: string | null
          name: string
          system_prompt: string
          temperature: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          model_name?: string | null
          model_provider?: string | null
          name: string
          system_prompt: string
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          model_name?: string | null
          model_provider?: string | null
          name?: string
          system_prompt?: string
          temperature?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      attribute_values: {
        Row: {
          attribute_id: string | null
          id: string
          value: string
        }
        Insert: {
          attribute_id?: string | null
          id?: string
          value: string
        }
        Update: {
          attribute_id?: string | null
          id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "attributes"
            referencedColumns: ["id"]
          },
        ]
      }
      attributes: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          lead_contact: string | null
          lead_name: string | null
          notes: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          lead_contact?: string | null
          lead_name?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          lead_contact?: string | null
          lead_name?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          quantity_available: number | null
          quantity_reserved: number | null
          updated_at: string | null
          variant_id: string | null
        }
        Insert: {
          id?: string
          quantity_available?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Update: {
          id?: string
          quantity_available?: number | null
          quantity_reserved?: number | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          content: string | null
          created_at: string
          embedding: string | null
          id: string
          metadata: Json | null
          summary: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          summary?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
          summary?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      lead_memories: {
        Row: {
          created_at: string
          embedding: string | null
          id: string
          session_id: string | null
          summary: string
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          id?: string
          session_id?: string | null
          summary: string
        }
        Update: {
          created_at?: string
          embedding?: string | null
          id?: string
          session_id?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_memories_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      leads_newsletter: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          sku: string | null
          total_price: number
          unit_price: number
          variant_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          sku?: string | null
          total_price: number
          unit_price: number
          variant_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          sku?: string | null
          total_price?: number
          unit_price?: number
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          affiliate_id: string | null
          commission_amount: number | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          shipping_address_id: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_id?: string | null
          commission_amount?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          shipping_address_id?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          cost_price_override: number | null
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          price_override: number | null
          product_id: string | null
          sku: string
        }
        Insert: {
          cost_price_override?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_override?: number | null
          product_id?: string | null
          sku: string
        }
        Update: {
          cost_price_override?: number | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          price_override?: number | null
          product_id?: string | null
          sku?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number | null
          cost_price: number
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_ai_optimized: boolean | null
          price: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          tags_json: Json | null
          title: string
        }
        Insert: {
          base_price?: number | null
          cost_price: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_ai_optimized?: boolean | null
          price: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          tags_json?: Json | null
          title: string
        }
        Update: {
          base_price?: number | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_ai_optimized?: boolean | null
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          tags_json?: Json | null
          title?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          base_content: string
          caption_instagram: string | null
          caption_tiktok: string | null
          caption_youtube: string | null
          created_at: string
          id: string
          media_url: string | null
          post_instagram: boolean | null
          post_tiktok: boolean | null
          post_youtube: boolean | null
          scheduled_date: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          base_content: string
          caption_instagram?: string | null
          caption_tiktok?: string | null
          caption_youtube?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          post_instagram?: boolean | null
          post_tiktok?: boolean | null
          post_youtube?: boolean | null
          scheduled_date: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          base_content?: string
          caption_instagram?: string | null
          caption_tiktok?: string | null
          caption_youtube?: string | null
          created_at?: string
          id?: string
          media_url?: string | null
          post_instagram?: boolean | null
          post_tiktok?: boolean | null
          post_youtube?: boolean | null
          scheduled_date?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      specialists: {
        Row: {
          cep: string | null
          created_at: string
          full_name: string
          id: string
          latitude: number | null
          longitude: number | null
          online_only: boolean | null
          professional_id: string
          specialties: string[] | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          created_at?: string
          full_name: string
          id: string
          latitude?: number | null
          longitude?: number | null
          online_only?: boolean | null
          professional_id: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          created_at?: string
          full_name?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          online_only?: boolean | null
          professional_id?: string
          specialties?: string[] | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          is_secret: boolean | null
          key_name: string
          key_value: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          description?: string | null
          id?: string
          is_secret?: boolean | null
          key_name: string
          key_value?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          description?: string | null
          id?: string
          is_secret?: boolean | null
          key_name?: string
          key_value?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      variant_attribute_values: {
        Row: {
          attribute_value_id: string
          variant_id: string
        }
        Insert: {
          attribute_value_id: string
          variant_id: string
        }
        Update: {
          attribute_value_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_attribute_values_attribute_value_id_fkey"
            columns: ["attribute_value_id"]
            isOneToOne: false
            referencedRelation: "attribute_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_attribute_values_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: {
          match_count: number
          match_threshold: number
          p_user_id: string
          query_embedding: string
        }
        Returns: {
          content: string
          id: string
          metadata: Json
          similarity: number
        }[]
      }
      process_affiliate_commission: {
        Args: { order_id: string }
        Returns: undefined
      }
    }
    Enums: {
      lead_status:
        | "Novo"
        | "Em Acompanhamento"
        | "Crítico"
        | "Encaminhado"
        | "Inativo"
      order_status:
        | "pending"
        | "processing"
        | "paid"
        | "shipped"
        | "delivered"
        | "cancelled"
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
      lead_status: [
        "Novo",
        "Em Acompanhamento",
        "Crítico",
        "Encaminhado",
        "Inativo",
      ],
      order_status: [
        "pending",
        "processing",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
      ],
    },
  },
} as const
