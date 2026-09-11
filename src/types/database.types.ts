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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      batch_events: {
        Row: {
          actor_id: string | null
          batch_id: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          location: string | null
          metadata: Json | null
          organization_id: string | null
          quantity: number | null
          timestamp: string | null
        }
        Insert: {
          actor_id?: string | null
          batch_id: string
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          metadata?: Json | null
          organization_id?: string | null
          quantity?: number | null
          timestamp?: string | null
        }
        Update: {
          actor_id?: string | null
          batch_id?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          location?: string | null
          metadata?: Json | null
          organization_id?: string | null
          quantity?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_events_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_number: string
          created_at: string | null
          current_quantity: number
          expiry_date: string
          id: string
          manufacturer_id: string | null
          medicine_name: string
          quantity: number
          status: Database["public"]["Enums"]["batch_status"]
          updated_at: string | null
        }
        Insert: {
          batch_number: string
          created_at?: string | null
          current_quantity: number
          expiry_date: string
          id?: string
          manufacturer_id?: string | null
          medicine_name: string
          quantity: number
          status?: Database["public"]["Enums"]["batch_status"]
          updated_at?: string | null
        }
        Update: {
          batch_number?: string
          created_at?: string | null
          current_quantity?: number
          expiry_date?: string
          id?: string
          manufacturer_id?: string | null
          medicine_name?: string
          quantity?: number
          status?: Database["public"]["Enums"]["batch_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      destruction_certificates: {
        Row: {
          batch_id: string
          certificate_number: string
          created_at: string | null
          destruction_date: string
          document_url: string | null
          facility_id: string | null
          id: string
          quantity_destroyed: number
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          batch_id: string
          certificate_number: string
          created_at?: string | null
          destruction_date: string
          document_url?: string | null
          facility_id?: string | null
          id?: string
          quantity_destroyed: number
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          batch_id?: string
          certificate_number?: string
          created_at?: string | null
          destruction_date?: string
          document_url?: string | null
          facility_id?: string | null
          id?: string
          quantity_destroyed?: number
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "destruction_certificates_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destruction_certificates_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          batch_id: string
          description: string | null
          detected_at: string | null
          detected_location: string | null
          id: string
          risk_score: number | null
          status: Database["public"]["Enums"]["alert_status"]
        }
        Insert: {
          alert_type: Database["public"]["Enums"]["alert_type"]
          batch_id: string
          description?: string | null
          detected_at?: string | null
          detected_location?: string | null
          id?: string
          risk_score?: number | null
          status?: Database["public"]["Enums"]["alert_status"]
        }
        Update: {
          alert_type?: Database["public"]["Enums"]["alert_type"]
          batch_id?: string
          description?: string | null
          detected_at?: string | null
          detected_location?: string | null
          id?: string
          risk_score?: number | null
          status?: Database["public"]["Enums"]["alert_status"]
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          location: string | null
          name: string
          type: Database["public"]["Enums"]["org_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          type: Database["public"]["Enums"]["org_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          type?: Database["public"]["Enums"]["org_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string
          organization_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          name: string
          organization_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          organization_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          batch_id: string
          created_at: string | null
          distributor_id: string | null
          expected_quantity: number
          id: string
          received_quantity: number | null
          retailer_id: string | null
          return_reason: string | null
          status: Database["public"]["Enums"]["return_status"]
          updated_at: string | null
        }
        Insert: {
          batch_id: string
          created_at?: string | null
          distributor_id?: string | null
          expected_quantity: number
          id?: string
          received_quantity?: number | null
          retailer_id?: string | null
          return_reason?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string | null
        }
        Update: {
          batch_id?: string
          created_at?: string | null
          distributor_id?: string | null
          expected_quantity?: number
          id?: string
          received_quantity?: number | null
          retailer_id?: string | null
          return_reason?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_batch_reentry: {
        Args: { p_batch_number: string; p_location?: string }
        Returns: Json
      }
      confirm_distributor_receipt: {
        Args: { p_batch_number: string; p_received_quantity: number }
        Returns: Json
      }
      create_return: {
        Args: {
          p_batch_number: string
          p_distributor_id: string
          p_expected_quantity: number
          p_reason?: string
          p_retailer_id: string
        }
        Returns: Json
      }
      get_authority_dashboard_stats: { Args: never; Returns: Json }
      get_batch_timeline: { Args: { p_batch_number: string }; Returns: Json }
      get_fraud_alert_detail: { Args: { p_alert_id: string }; Returns: Json }
      get_my_org: { Args: never; Returns: string }
      get_my_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      mark_batch_destroyed: {
        Args: {
          p_batch_number: string
          p_certificate_number: string
          p_document_url?: string
          p_facility_id: string
          p_quantity_destroyed: number
        }
        Returns: Json
      }
      mark_manufacturer_received: {
        Args: { p_batch_number: string }
        Returns: Json
      }
      reset_demo: { Args: never; Returns: Json }
    }
    Enums: {
      alert_status:
        | "OPEN"
        | "INVESTIGATING"
        | "DISMISSED"
        | "ESCALATED"
        | "RESOLVED"
      alert_type:
        | "DESTROYED_BATCH_REENTRY"
        | "QUANTITY_DISCREPANCY"
        | "CERTIFICATE_MISMATCH"
        | "DUPLICATE_BATCH"
        | "SUSPICIOUS_ACTIVITY"
      batch_status:
        | "ACTIVE"
        | "EXPIRING_SOON"
        | "EXPIRED"
        | "RETURN_REQUESTED"
        | "DISTRIBUTOR_RECEIVED"
        | "MANUFACTURER_RECEIVED"
        | "PENDING_DESTRUCTION"
        | "DESTROYED"
        | "DISPUTED"
        | "FRAUD_ALERT"
      event_type:
        | "MANUFACTURED"
        | "EXPIRY_WARNING"
        | "EXPIRED"
        | "RETURN_CREATED"
        | "PICKUP_ASSIGNED"
        | "DISTRIBUTOR_RECEIVED"
        | "MANUFACTURER_RECEIVED"
        | "SENT_FOR_DESTRUCTION"
        | "DESTROYED"
        | "REENTRY_DETECTED"
        | "DISPUTE_CREATED"
      org_type:
        | "RETAILER"
        | "DISTRIBUTOR"
        | "MANUFACTURER"
        | "WASTE_FACILITY"
        | "AUTHORITY"
      return_status:
        | "REQUESTED"
        | "PICKUP_ASSIGNED"
        | "RECEIVED"
        | "DISPUTED"
        | "RESOLVED"
        | "COMPLETED"
      user_role: "RETAILER" | "DISTRIBUTOR" | "MANUFACTURER" | "AUTHORITY"
      verification_status: "PENDING" | "VERIFIED" | "MISMATCH" | "REJECTED"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      alert_status: [
        "OPEN",
        "INVESTIGATING",
        "DISMISSED",
        "ESCALATED",
        "RESOLVED",
      ],
      alert_type: [
        "DESTROYED_BATCH_REENTRY",
        "QUANTITY_DISCREPANCY",
        "CERTIFICATE_MISMATCH",
        "DUPLICATE_BATCH",
        "SUSPICIOUS_ACTIVITY",
      ],
      batch_status: [
        "ACTIVE",
        "EXPIRING_SOON",
        "EXPIRED",
        "RETURN_REQUESTED",
        "DISTRIBUTOR_RECEIVED",
        "MANUFACTURER_RECEIVED",
        "PENDING_DESTRUCTION",
        "DESTROYED",
        "DISPUTED",
        "FRAUD_ALERT",
      ],
      event_type: [
        "MANUFACTURED",
        "EXPIRY_WARNING",
        "EXPIRED",
        "RETURN_CREATED",
        "PICKUP_ASSIGNED",
        "DISTRIBUTOR_RECEIVED",
        "MANUFACTURER_RECEIVED",
        "SENT_FOR_DESTRUCTION",
        "DESTROYED",
        "REENTRY_DETECTED",
        "DISPUTE_CREATED",
      ],
      org_type: [
        "RETAILER",
        "DISTRIBUTOR",
        "MANUFACTURER",
        "WASTE_FACILITY",
        "AUTHORITY",
      ],
      return_status: [
        "REQUESTED",
        "PICKUP_ASSIGNED",
        "RECEIVED",
        "DISPUTED",
        "RESOLVED",
        "COMPLETED",
      ],
      user_role: ["RETAILER", "DISTRIBUTOR", "MANUFACTURER", "AUTHORITY"],
      verification_status: ["PENDING", "VERIFIED", "MISMATCH", "REJECTED"],
    },
  },
} as const
