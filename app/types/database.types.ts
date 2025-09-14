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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author_id: string
          bookshelves_book_id: string | null
          category_slug: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          label: Database["public"]["Enums"]["book_label"] | null
          published_at: string | null
          rating: number
          reading_sessions_book_id: string | null
          saves: number | null
          slug: string | null
          status: Database["public"]["Enums"]["book_status"]
          title: string
          trope: string[] | null
          updated_at: string
        }
        Insert: {
          author_id?: string
          bookshelves_book_id?: string | null
          category_slug?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          label?: Database["public"]["Enums"]["book_label"] | null
          published_at?: string | null
          rating?: number
          reading_sessions_book_id?: string | null
          saves?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["book_status"]
          title: string
          trope?: string[] | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          bookshelves_book_id?: string | null
          category_slug?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          label?: Database["public"]["Enums"]["book_label"] | null
          published_at?: string | null
          rating?: number
          reading_sessions_book_id?: string | null
          saves?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["book_status"]
          title?: string
          trope?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "books_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "books_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      bookshelves: {
        Row: {
          added_at: string | null
          book_id: string
          id: string
          status: Database["public"]["Enums"]["shelf_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          book_id: string
          id?: string
          status?: Database["public"]["Enums"]["shelf_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          book_id?: string
          id?: string
          status?: Database["public"]["Enums"]["shelf_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookshelves_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookshelves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      chapters: {
        Row: {
          book_id: string
          chapter_number: number
          chapter_title: string
          coin_cost: number | null
          content: string
          created_at: string
          id: string
          is_locked: boolean
          reading_sessions_chapter_id: string | null
          updated_at: string
        }
        Insert: {
          book_id?: string
          chapter_number: number
          chapter_title: string
          coin_cost?: number | null
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean
          reading_sessions_chapter_id?: string | null
          updated_at?: string
        }
        Update: {
          book_id?: string
          chapter_number?: number
          chapter_title?: string
          coin_cost?: number | null
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean
          reading_sessions_chapter_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          related_entity_id: string | null
          type: Database["public"]["Enums"]["transaction_type"] | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          related_entity_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"] | null
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          related_entity_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          is_read: boolean | null
          message: string
          sent_at: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          id?: string
          is_read?: boolean | null
          message: string
          sent_at?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          id?: string
          is_read?: boolean | null
          message?: string
          sent_at?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bookshelves_user_id: string | null
          coin_balance: number
          created_at: string
          id: string
          notifications_user_id: string | null
          reading_sessions_user_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bookshelves_user_id?: string | null
          coin_balance?: number
          created_at?: string
          id?: string
          notifications_user_id?: string | null
          reading_sessions_user_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bookshelves_user_id?: string | null
          coin_balance?: number
          created_at?: string
          id?: string
          notifications_user_id?: string | null
          reading_sessions_user_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_bookshelves_user_id_fkey"
            columns: ["bookshelves_user_id"]
            isOneToOne: false
            referencedRelation: "bookshelves"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_notifications_user_id_fkey"
            columns: ["notifications_user_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_reading_sessions_user_id_fkey"
            columns: ["reading_sessions_user_id"]
            isOneToOne: false
            referencedRelation: "reading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_sessions: {
        Row: {
          book_id: string
          chapter_id: string
          ended_at: string | null
          id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_id: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string
          ended_at?: string | null
          id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reading_sessions_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_sessions_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_sessions_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["reading_sessions_book_id"]
          },
          {
            foreignKeyName: "reading_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          book_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chapter_unlocks: {
        Row: {
          chapter_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          chapter_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          chapter_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chapter_unlocks_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chapter_unlocks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_author_or_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      book_label: "popular" | "trending" | "limited_edition"
      book_status:
        | "draft"
        | "pending_review"
        | "published"
        | "rejected"
        | "archived"
      notification_type:
        | "NEW_CHAPTER"
        | "BOOK_APPROVED"
        | "BOOK_REJECTED"
        | "COIN_PURCHASE_CONFIRMED"
        | "COIN_CASHOUT_PROCESSED"
      shelf_status: "want_to_read" | "reading" | "completed" | "favourite"
      transaction_type: "purchase" | "spend"
      user_role: "reader" | "author" | "admin"
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
      book_label: ["popular", "trending", "limited_edition"],
      book_status: [
        "draft",
        "pending_review",
        "published",
        "rejected",
        "archived",
      ],
      notification_type: [
        "NEW_CHAPTER",
        "BOOK_APPROVED",
        "BOOK_REJECTED",
        "COIN_PURCHASE_CONFIRMED",
        "COIN_CASHOUT_PROCESSED",
      ],
      shelf_status: ["want_to_read", "reading", "completed", "favourite"],
      transaction_type: ["purchase", "spend"],
      user_role: ["reader", "author", "admin"],
    },
  },
} as const
