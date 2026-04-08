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
      brand_applications: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          brand_description: string | null
          brand_email: string
          brand_logo_url: string | null
          brand_name: string
          brand_phone: string | null
          brand_website: string | null
          company_address: string | null
          company_city: string | null
          company_country: string | null
          company_legal_name: string | null
          company_state: string | null
          company_zip_code: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string | null
          favorite_count: number | null
          id: string
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          brand_description?: string | null
          brand_email: string
          brand_logo_url?: string | null
          brand_name: string
          brand_phone?: string | null
          brand_website?: string | null
          company_address?: string | null
          company_city?: string | null
          company_country?: string | null
          company_legal_name?: string | null
          company_state?: string | null
          company_zip_code?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string | null
          favorite_count?: number | null
          id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          brand_description?: string | null
          brand_email?: string
          brand_logo_url?: string | null
          brand_name?: string
          brand_phone?: string | null
          brand_website?: string | null
          company_address?: string | null
          company_city?: string | null
          company_country?: string | null
          company_legal_name?: string | null
          company_state?: string | null
          company_zip_code?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string | null
          favorite_count?: number | null
          id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      brand_documents: {
        Row: {
          application_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_at: string | null
        }
        Insert: {
          application_id: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_at?: string | null
        }
        Update: {
          application_id?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "brand_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_favorites: {
        Row: {
          brand_id: string
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_favorites_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_products: {
        Row: {
          best_time_of_day: string[] | null
          brand_id: string
          category_id: string | null
          cbd_content: number | null
          cbd_unit: string | null
          coa_url: string | null
          created_at: string | null
          description: string | null
          dominant_terpenes: Json | null
          duration: string | null
          flavor_profile: string[] | null
          form_factor_details: Json | null
          id: string
          image_url: string | null
          indica_sativa_ratio: string | null
          is_active: boolean | null
          lab_tested: boolean | null
          listing_count: number | null
          medical_benefits: string[] | null
          name: string
          onset_time: string | null
          organic: boolean | null
          pesticide_free: boolean | null
          potency_category: string | null
          primary_effects: string[] | null
          product_category: string | null
          product_format: string | null
          recommended_experience_level: string[] | null
          secondary_effects: string[] | null
          strain_lineage: string[] | null
          strain_name: string | null
          strain_type: string | null
          suggested_retail_price: number | null
          thc_cbd_ratio: string | null
          thc_content: number | null
          thc_unit: string | null
          updated_at: string | null
          wholesale_price: number | null
        }
        Insert: {
          best_time_of_day?: string[] | null
          brand_id: string
          category_id?: string | null
          cbd_content?: number | null
          cbd_unit?: string | null
          coa_url?: string | null
          created_at?: string | null
          description?: string | null
          dominant_terpenes?: Json | null
          duration?: string | null
          flavor_profile?: string[] | null
          form_factor_details?: Json | null
          id?: string
          image_url?: string | null
          indica_sativa_ratio?: string | null
          is_active?: boolean | null
          lab_tested?: boolean | null
          listing_count?: number | null
          medical_benefits?: string[] | null
          name: string
          onset_time?: string | null
          organic?: boolean | null
          pesticide_free?: boolean | null
          potency_category?: string | null
          primary_effects?: string[] | null
          product_category?: string | null
          product_format?: string | null
          recommended_experience_level?: string[] | null
          secondary_effects?: string[] | null
          strain_lineage?: string[] | null
          strain_name?: string | null
          strain_type?: string | null
          suggested_retail_price?: number | null
          thc_cbd_ratio?: string | null
          thc_content?: number | null
          thc_unit?: string | null
          updated_at?: string | null
          wholesale_price?: number | null
        }
        Update: {
          best_time_of_day?: string[] | null
          brand_id?: string
          category_id?: string | null
          cbd_content?: number | null
          cbd_unit?: string | null
          coa_url?: string | null
          created_at?: string | null
          description?: string | null
          dominant_terpenes?: Json | null
          duration?: string | null
          flavor_profile?: string[] | null
          form_factor_details?: Json | null
          id?: string
          image_url?: string | null
          indica_sativa_ratio?: string | null
          is_active?: boolean | null
          lab_tested?: boolean | null
          listing_count?: number | null
          medical_benefits?: string[] | null
          name?: string
          onset_time?: string | null
          organic?: boolean | null
          pesticide_free?: boolean | null
          potency_category?: string | null
          primary_effects?: string[] | null
          product_category?: string | null
          product_format?: string | null
          recommended_experience_level?: string[] | null
          secondary_effects?: string[] | null
          strain_lineage?: string[] | null
          strain_name?: string | null
          strain_type?: string | null
          suggested_retail_price?: number | null
          thc_cbd_ratio?: string | null
          thc_content?: number | null
          thc_unit?: string | null
          updated_at?: string | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_applications: {
        Row: {
          accepted_payment_methods: Database["public"]["Enums"]["payment_method"][]
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          business_address: string
          business_city: string | null
          business_country: string | null
          business_email: string
          business_latitude: number | null
          business_logo_url: string | null
          business_longitude: number | null
          business_name: string
          business_phone: string
          business_state: string | null
          business_street: string | null
          business_zip_code: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string
          delivery_radius_miles: number | null
          favorite_count: number | null
          hours_of_operation: Json
          id: string
          pickup_radius_miles: number | null
          retailer_type: Database["public"]["Enums"]["retailer_type"]
          service_area_enabled: boolean | null
          service_area_polygon: Json | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          subscription_plan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accepted_payment_methods: Database["public"]["Enums"]["payment_method"][]
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_address: string
          business_city?: string | null
          business_country?: string | null
          business_email: string
          business_latitude?: number | null
          business_logo_url?: string | null
          business_longitude?: number | null
          business_name: string
          business_phone: string
          business_state?: string | null
          business_street?: string | null
          business_zip_code?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          delivery_radius_miles?: number | null
          favorite_count?: number | null
          hours_of_operation: Json
          id?: string
          pickup_radius_miles?: number | null
          retailer_type?: Database["public"]["Enums"]["retailer_type"]
          service_area_enabled?: boolean | null
          service_area_polygon?: Json | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          subscription_plan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accepted_payment_methods?: Database["public"]["Enums"]["payment_method"][]
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          business_address?: string
          business_city?: string | null
          business_country?: string | null
          business_email?: string
          business_latitude?: number | null
          business_logo_url?: string | null
          business_longitude?: number | null
          business_name?: string
          business_phone?: string
          business_state?: string | null
          business_street?: string | null
          business_zip_code?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          delivery_radius_miles?: number | null
          favorite_count?: number | null
          hours_of_operation?: Json
          id?: string
          pickup_radius_miles?: number | null
          retailer_type?: Database["public"]["Enums"]["retailer_type"]
          service_area_enabled?: boolean | null
          service_area_polygon?: Json | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          subscription_plan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_brand_products: {
        Row: {
          brand_product_id: string
          business_id: string
          created_at: string | null
          custom_price: number | null
          id: string
          is_listed: boolean | null
          product_id: string | null
          stock_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          brand_product_id: string
          business_id: string
          created_at?: string | null
          custom_price?: number | null
          id?: string
          is_listed?: boolean | null
          product_id?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          brand_product_id?: string
          business_id?: string
          created_at?: string | null
          custom_price?: number | null
          id?: string
          is_listed?: boolean | null
          product_id?: string | null
          stock_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_brand_products_brand_product_id_fkey"
            columns: ["brand_product_id"]
            isOneToOne: false
            referencedRelation: "brand_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_brand_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_brand_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_documents: {
        Row: {
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          uploaded_at: string
        }
        Insert: {
          application_id: string
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          uploaded_at?: string
        }
        Update: {
          application_id?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      business_favorites: {
        Row: {
          business_id: string
          created_at: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address_line1: string
          address_line2: string | null
          business_id: string
          city: string
          coordinates: unknown
          created_at: string
          id: string
          is_active: boolean
          is_primary: boolean
          latitude: number
          longitude: number
          name: string
          postal_code: string
          state: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          business_id: string
          city: string
          coordinates?: unknown
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          latitude: number
          longitude: number
          name: string
          postal_code: string
          state: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          business_id?: string
          city?: string
          coordinates?: unknown
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          latitude?: number
          longitude?: number
          name?: string
          postal_code?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_pii_access_log: {
        Row: {
          access_reason: string | null
          access_type: string
          accessed_at: string
          accessed_by_business_id: string | null
          accessed_by_user_id: string
          id: string
          ip_address: unknown
          order_id: string | null
          pii_fields_accessed: string[] | null
          user_agent: string | null
        }
        Insert: {
          access_reason?: string | null
          access_type: string
          accessed_at?: string
          accessed_by_business_id?: string | null
          accessed_by_user_id: string
          id?: string
          ip_address?: unknown
          order_id?: string | null
          pii_fields_accessed?: string[] | null
          user_agent?: string | null
        }
        Update: {
          access_reason?: string | null
          access_type?: string
          accessed_at?: string
          accessed_by_business_id?: string | null
          accessed_by_user_id?: string
          id?: string
          ip_address?: unknown
          order_id?: string | null
          pii_fields_accessed?: string[] | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_pii_access_log_accessed_by_business_id_fkey"
            columns: ["accessed_by_business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_pii_access_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_recommendation_queue: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          notifications_queued: number | null
          process_after: string
          processed_at: string | null
          products_checked: number | null
          scheduled_date: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          notifications_queued?: number | null
          process_after: string
          processed_at?: string | null
          products_checked?: number | null
          scheduled_date: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          notifications_queued?: number | null
          process_after?: string
          processed_at?: string | null
          products_checked?: number | null
          scheduled_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      deal_alert_notification_queue: {
        Row: {
          business_id: string | null
          created_at: string | null
          discount_percent: number
          error_message: string | null
          id: string
          max_retries: number | null
          processed_at: string | null
          product_id: string
          retry_count: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          discount_percent: number
          error_message?: string | null
          id?: string
          max_retries?: number | null
          processed_at?: string | null
          product_id: string
          retry_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          discount_percent?: number
          error_message?: string | null
          id?: string
          max_retries?: number | null
          processed_at?: string | null
          product_id?: string
          retry_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_alert_notification_queue_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_alert_notification_queue_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      deleted_users: {
        Row: {
          deleted_at: string | null
          deletion_reason: string | null
          email_hash: string | null
          id: string
          original_user_id: string
        }
        Insert: {
          deleted_at?: string | null
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          original_user_id: string
        }
        Update: {
          deleted_at?: string | null
          deletion_reason?: string | null
          email_hash?: string | null
          id?: string
          original_user_id?: string
        }
        Relationships: []
      }
      inventory_history: {
        Row: {
          change_type: string
          changed_by: string | null
          created_at: string
          id: string
          order_id: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reason: string | null
        }
        Insert: {
          change_type: string
          changed_by?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          product_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reason?: string | null
        }
        Update: {
          change_type?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string
          quantity_after?: number
          quantity_before?: number
          quantity_change?: number
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      legal_boundaries: {
        Row: {
          boundary: unknown
          cannabis_legal: boolean
          cannabis_tax_rate: number | null
          city_name: string | null
          county_name: string | null
          created_at: string | null
          delivery_allowed: boolean
          id: string
          is_active: boolean | null
          jurisdiction: string
          jurisdiction_type: string
          max_possession_grams: number | null
          max_purchase_grams: number | null
          medical_only: boolean
          min_age: number | null
          notes: string | null
          operating_hours: Json | null
          pickup_allowed: boolean
          recreational_allowed: boolean
          restrictions: Json | null
          state_code: string | null
          updated_at: string | null
        }
        Insert: {
          boundary?: unknown
          cannabis_legal?: boolean
          cannabis_tax_rate?: number | null
          city_name?: string | null
          county_name?: string | null
          created_at?: string | null
          delivery_allowed?: boolean
          id?: string
          is_active?: boolean | null
          jurisdiction: string
          jurisdiction_type: string
          max_possession_grams?: number | null
          max_purchase_grams?: number | null
          medical_only?: boolean
          min_age?: number | null
          notes?: string | null
          operating_hours?: Json | null
          pickup_allowed?: boolean
          recreational_allowed?: boolean
          restrictions?: Json | null
          state_code?: string | null
          updated_at?: string | null
        }
        Update: {
          boundary?: unknown
          cannabis_legal?: boolean
          cannabis_tax_rate?: number | null
          city_name?: string | null
          county_name?: string | null
          created_at?: string | null
          delivery_allowed?: boolean
          id?: string
          is_active?: boolean | null
          jurisdiction?: string
          jurisdiction_type?: string
          max_possession_grams?: number | null
          max_purchase_grams?: number | null
          medical_only?: boolean
          min_age?: number | null
          notes?: string | null
          operating_hours?: Json | null
          pickup_allowed?: boolean
          recreational_allowed?: boolean
          restrictions?: Json | null
          state_code?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      new_product_notification_queue: {
        Row: {
          business_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          max_retries: number | null
          processed_at: string | null
          product_id: string
          retry_count: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          processed_at?: string | null
          product_id: string
          retry_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_retries?: number | null
          processed_at?: string | null
          product_id?: string
          retry_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "new_product_notification_queue_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "new_product_notification_queue_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          deal_alert_enabled: boolean | null
          general_enabled: boolean | null
          id: string
          last_location_latitude: number | null
          last_location_longitude: number | null
          last_location_updated_at: string | null
          location_cache_ttl_hours: number | null
          location_change_settling_until: string | null
          max_daily_priority_alerts: number | null
          max_daily_product_alerts: number | null
          max_daily_regular_alerts: number | null
          notification_radius_km: number | null
          notification_radius_miles: number | null
          order_update_enabled: boolean | null
          preferred_radius_miles: number | null
          product_match_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string | null
          user_id: string
          user_timezone: string | null
        }
        Insert: {
          created_at?: string | null
          deal_alert_enabled?: boolean | null
          general_enabled?: boolean | null
          id?: string
          last_location_latitude?: number | null
          last_location_longitude?: number | null
          last_location_updated_at?: string | null
          location_cache_ttl_hours?: number | null
          location_change_settling_until?: string | null
          max_daily_priority_alerts?: number | null
          max_daily_product_alerts?: number | null
          max_daily_regular_alerts?: number | null
          notification_radius_km?: number | null
          notification_radius_miles?: number | null
          order_update_enabled?: boolean | null
          preferred_radius_miles?: number | null
          product_match_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id: string
          user_timezone?: string | null
        }
        Update: {
          created_at?: string | null
          deal_alert_enabled?: boolean | null
          general_enabled?: boolean | null
          id?: string
          last_location_latitude?: number | null
          last_location_longitude?: number | null
          last_location_updated_at?: string | null
          location_cache_ttl_hours?: number | null
          location_change_settling_until?: string | null
          max_daily_priority_alerts?: number | null
          max_daily_product_alerts?: number | null
          max_daily_regular_alerts?: number | null
          notification_radius_km?: number | null
          notification_radius_miles?: number | null
          order_update_enabled?: boolean | null
          preferred_radius_miles?: number | null
          product_match_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id?: string
          user_timezone?: string | null
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          deep_link: string | null
          delivery_status: string | null
          failed_reason: string | null
          fcm_message_id: string | null
          id: string
          image_url: string | null
          max_retries: number | null
          priority: number | null
          retry_count: number | null
          scheduled_for: string
          sent_at: string | null
          status: string
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivery_status?: string | null
          failed_reason?: string | null
          fcm_message_id?: string | null
          id?: string
          image_url?: string | null
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivery_status?: string | null
          failed_reason?: string | null
          fcm_message_id?: string | null
          id?: string
          image_url?: string | null
          max_retries?: number | null
          priority?: number | null
          retry_count?: number | null
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          clicked_at: string | null
          created_at: string | null
          data: Json | null
          deep_link: string | null
          delivered_at: string | null
          delivery_status: string | null
          dismissed_at: string | null
          fcm_message_id: string | null
          id: string
          image_url: string | null
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          clicked_at?: string | null
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          dismissed_at?: string | null
          fcm_message_id?: string | null
          id?: string
          image_url?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          clicked_at?: string | null
          created_at?: string | null
          data?: Json | null
          deep_link?: string | null
          delivered_at?: string | null
          delivery_status?: string | null
          dismissed_at?: string | null
          fcm_message_id?: string | null
          id?: string
          image_url?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          changed_by_role: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          metadata: Json | null
          notes: string | null
          order_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_by?: string | null
          changed_by_role?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_by?: string | null
          changed_by_role?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_transitions: {
        Row: {
          description: string | null
          from_status: Database["public"]["Enums"]["order_status"]
          id: string
          requires_role: string[] | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          description?: string | null
          from_status: Database["public"]["Enums"]["order_status"]
          id?: string
          requires_role?: string[] | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          description?: string | null
          from_status?: Database["public"]["Enums"]["order_status"]
          id?: string
          requires_role?: string[] | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: []
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          business_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string | null
          delivery_city: string | null
          delivery_coordinates: unknown
          delivery_fee: number | null
          delivery_instructions: string | null
          delivery_method: Database["public"]["Enums"]["delivery_method"] | null
          delivery_postal_code: string | null
          delivery_state: string | null
          discount_amount: number | null
          estimated_delivery_time: string | null
          id: string
          notes: string | null
          order_number: string | null
          payment_confirmed_at: string | null
          payment_confirmed_by: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          retailer_payment_reference: string | null
          scheduled_delivery_time: string | null
          selected_payment_method: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number | null
          tax: number | null
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          actual_delivery_time?: string | null
          business_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_coordinates?: unknown
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          delivery_postal_code?: string | null
          delivery_state?: string | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          retailer_payment_reference?: string | null
          scheduled_delivery_time?: string | null
          selected_payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          tax?: number | null
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          actual_delivery_time?: string | null
          business_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_coordinates?: unknown
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_method?:
            | Database["public"]["Enums"]["delivery_method"]
            | null
          delivery_postal_code?: string | null
          delivery_state?: string | null
          discount_amount?: number | null
          estimated_delivery_time?: string | null
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_confirmed_at?: string | null
          payment_confirmed_by?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          retailer_payment_reference?: string | null
          scheduled_delivery_time?: string | null
          selected_payment_method?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number | null
          tax?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      product_geo_restrictions: {
        Row: {
          area_boundary: unknown
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          product_id: string
          restriction_type: string
          updated_at: string
        }
        Insert: {
          area_boundary: unknown
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          product_id: string
          restriction_type: string
          updated_at?: string
        }
        Update: {
          area_boundary?: unknown
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          product_id?: string
          restriction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_geo_restrictions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_questions: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_required: boolean
          options: Json | null
          product_id: string
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_required?: boolean
          options?: Json | null
          product_id: string
          question_text: string
          question_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_required?: boolean
          options?: Json | null
          product_id?: string
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_questions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_survey_responses: {
        Row: {
          created_at: string
          id: string
          product_id: string
          question_id: string
          response_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          question_id: string
          response_value: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          question_id?: string
          response_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          average_rating: number | null
          best_time_of_day: string[] | null
          brand_name: string | null
          business_id: string
          category_id: string | null
          cbd_category: string | null
          cbd_content: number | null
          cbd_unit: string | null
          coa_url: string | null
          created_at: string
          description: string | null
          discount_price: number | null
          dominant_terpenes: Json | null
          duration: string | null
          favorite_count: number
          flavor_profile: string[] | null
          form_factor_details: Json | null
          id: string
          image_url: string | null
          indica_sativa_ratio: string | null
          is_active: boolean
          lab_tested: boolean | null
          medical_benefits: string[] | null
          name: string
          onset_time: string | null
          organic: boolean | null
          pesticide_free: boolean | null
          popularity_score: number | null
          potency_category: string | null
          price: number
          primary_effects: string[] | null
          product_category: string | null
          product_format: string | null
          recommended_experience_level: string[] | null
          review_count: number | null
          secondary_effects: string[] | null
          source_brand_product_id: string | null
          stock_quantity: number
          strain_lineage: string[] | null
          strain_name: string | null
          strain_type: string | null
          thc_cbd_ratio: string | null
          thc_content: number | null
          thc_unit: string | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          best_time_of_day?: string[] | null
          brand_name?: string | null
          business_id: string
          category_id?: string | null
          cbd_category?: string | null
          cbd_content?: number | null
          cbd_unit?: string | null
          coa_url?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          dominant_terpenes?: Json | null
          duration?: string | null
          favorite_count?: number
          flavor_profile?: string[] | null
          form_factor_details?: Json | null
          id?: string
          image_url?: string | null
          indica_sativa_ratio?: string | null
          is_active?: boolean
          lab_tested?: boolean | null
          medical_benefits?: string[] | null
          name: string
          onset_time?: string | null
          organic?: boolean | null
          pesticide_free?: boolean | null
          popularity_score?: number | null
          potency_category?: string | null
          price: number
          primary_effects?: string[] | null
          product_category?: string | null
          product_format?: string | null
          recommended_experience_level?: string[] | null
          review_count?: number | null
          secondary_effects?: string[] | null
          source_brand_product_id?: string | null
          stock_quantity?: number
          strain_lineage?: string[] | null
          strain_name?: string | null
          strain_type?: string | null
          thc_cbd_ratio?: string | null
          thc_content?: number | null
          thc_unit?: string | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          best_time_of_day?: string[] | null
          brand_name?: string | null
          business_id?: string
          category_id?: string | null
          cbd_category?: string | null
          cbd_content?: number | null
          cbd_unit?: string | null
          coa_url?: string | null
          created_at?: string
          description?: string | null
          discount_price?: number | null
          dominant_terpenes?: Json | null
          duration?: string | null
          favorite_count?: number
          flavor_profile?: string[] | null
          form_factor_details?: Json | null
          id?: string
          image_url?: string | null
          indica_sativa_ratio?: string | null
          is_active?: boolean
          lab_tested?: boolean | null
          medical_benefits?: string[] | null
          name?: string
          onset_time?: string | null
          organic?: boolean | null
          pesticide_free?: boolean | null
          popularity_score?: number | null
          potency_category?: string | null
          price?: number
          primary_effects?: string[] | null
          product_category?: string | null
          product_format?: string | null
          recommended_experience_level?: string[] | null
          review_count?: number | null
          secondary_effects?: string[] | null
          source_brand_product_id?: string | null
          stock_quantity?: number
          strain_lineage?: string[] | null
          strain_name?: string | null
          strain_type?: string | null
          thc_cbd_ratio?: string | null
          thc_content?: number | null
          thc_unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_source_brand_product_id_fkey"
            columns: ["source_brand_product_id"]
            isOneToOne: false
            referencedRelation: "brand_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_verified_at: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          email: string
          has_medical_card: boolean | null
          id: string
          notification_preferences: Json | null
          phone_number: string | null
          preferred_language: string | null
          privacy_settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_verified_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          email: string
          has_medical_card?: boolean | null
          id?: string
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_language?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_verified_at?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          email?: string
          has_medical_card?: boolean | null
          id?: string
          notification_preferences?: Json | null
          phone_number?: string | null
          preferred_language?: string | null
          privacy_settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendation_analytics: {
        Row: {
          cache_hit: boolean
          created_at: string | null
          id: string
          metadata: Json | null
          product_count: number
          request_params: Json | null
          response_time_ms: number
          strategy: string
          user_id: string
        }
        Insert: {
          cache_hit?: boolean
          created_at?: string | null
          id?: string
          metadata?: Json | null
          product_count?: number
          request_params?: Json | null
          response_time_ms: number
          strategy: string
          user_id: string
        }
        Update: {
          cache_hit?: boolean
          created_at?: string | null
          id?: string
          metadata?: Json | null
          product_count?: number
          request_params?: Json | null
          response_time_ms?: number
          strategy?: string
          user_id?: string
        }
        Relationships: []
      }
      review_helpful: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          comment: string | null
          created_at: string
          customer_email: string | null
          customer_name: string
          id: string
          product_id: string | null
          rating: number
        }
        Insert: {
          business_id: string
          comment?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name: string
          id?: string
          product_id?: string | null
          rating: number
        }
        Update: {
          business_id?: string
          comment?: string | null
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          id?: string
          product_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          search_term: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          search_term: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          search_term?: string
          user_id?: string
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          boundary: unknown
          business_id: string
          business_location_id: string
          created_at: string
          delivery_fee: number
          estimated_delivery_time: number | null
          id: string
          is_active: boolean
          minimum_order: number
          name: string
          priority_level: number
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string
        }
        Insert: {
          boundary: unknown
          business_id: string
          business_location_id: string
          created_at?: string
          delivery_fee?: number
          estimated_delivery_time?: number | null
          id?: string
          is_active?: boolean
          minimum_order?: number
          name: string
          priority_level?: number
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Update: {
          boundary?: unknown
          business_id?: string
          business_location_id?: string
          created_at?: string
          delivery_fee?: number
          estimated_delivery_time?: number | null
          id?: string
          is_active?: boolean
          minimum_order?: number
          name?: string
          priority_level?: number
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_areas_business_location_id_fkey"
            columns: ["business_location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          business_id: string
          created_at: string
          id: string
          message: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          message: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          message?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_questions: {
        Row: {
          category: string | null
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          is_required: boolean
          max_value: number | null
          min_value: number | null
          options: Json | null
          question_text: string
          question_type: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_required?: boolean
          max_value?: number | null
          min_value?: number | null
          options?: Json | null
          question_text: string
          question_type: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_required?: boolean
          max_value?: number | null
          min_value?: number | null
          options?: Json | null
          question_text?: string
          question_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_config: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          created_at: string | null
          document_type: string
          expires_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_active: boolean | null
          mime_type: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          expires_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          expires_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          mime_type?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          product_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          interaction_metadata: Json | null
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          product_id: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          interaction_metadata?: Json | null
          interaction_type: Database["public"]["Enums"]["interaction_type"]
          product_id: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          interaction_metadata?: Json | null
          interaction_type?: Database["public"]["Enums"]["interaction_type"]
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          coordinates: unknown
          created_at: string
          delivery_instructions: string | null
          id: string
          is_default: boolean
          is_verified: boolean
          label: string | null
          latitude: number
          longitude: number
          postal_code: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          coordinates?: unknown
          created_at?: string
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean
          is_verified?: boolean
          label?: string | null
          latitude: number
          longitude: number
          postal_code: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          coordinates?: unknown
          created_at?: string
          delivery_instructions?: string | null
          id?: string
          is_default?: boolean
          is_verified?: boolean
          label?: string | null
          latitude?: number
          longitude?: number
          postal_code?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          desired_effects: string[] | null
          experience_level: string | null
          favorite_strains: string[] | null
          flavor_preferences: string[] | null
          id: string
          potency_preference: string[] | null
          preferred_methods: string[] | null
          strain_type_preference: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          desired_effects?: string[] | null
          experience_level?: string | null
          favorite_strains?: string[] | null
          flavor_preferences?: string[] | null
          id?: string
          potency_preference?: string[] | null
          preferred_methods?: string[] | null
          strain_type_preference?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          desired_effects?: string[] | null
          experience_level?: string | null
          favorite_strains?: string[] | null
          flavor_preferences?: string[] | null
          id?: string
          potency_preference?: string[] | null
          preferred_methods?: string[] | null
          strain_type_preference?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_push_tokens: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_id: string | null
          enabled: boolean | null
          id: string
          last_used_at: string | null
          platform: string
          token: string
          user_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_id?: string | null
          enabled?: boolean | null
          id?: string
          last_used_at?: string | null
          platform: string
          token: string
          user_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_id?: string | null
          enabled?: boolean | null
          id?: string
          last_used_at?: string | null
          platform?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_survey_responses: {
        Row: {
          created_at: string
          id: string
          question_id: string
          response_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          response_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          response_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_survey_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
      notification_analytics: {
        Row: {
          click_rate_pct: number | null
          clicked: number | null
          date: string | null
          delivered: number | null
          dismiss_rate_pct: number | null
          dismissed: number | null
          failed: number | null
          read: number | null
          total_sent: number | null
          type: string | null
        }
        Relationships: []
      }
      product_interaction_stats: {
        Row: {
          cart_count: number | null
          click_count: number | null
          last_interaction: string | null
          product_id: string | null
          purchase_count: number | null
          share_count: number | null
          total_interactions: number | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendation_metrics: {
        Row: {
          avg_products_returned: number | null
          avg_response_time_ms: number | null
          cache_hits: number | null
          cache_misses: number | null
          hour_bucket: string | null
          strategy: string | null
          total_requests: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      anonymize_user_data: { Args: { p_user_id: string }; Returns: undefined }
      businesses_serving_location: {
        Args: { lat: number; lng: number }
        Returns: {
          business_id: string
          business_name: string
          delivery_fee: number
          estimated_delivery_time: number
          id: string
        }[]
      }
      businesses_within_delivery_range: {
        Args: { user_lat: number; user_lon: number }
        Returns: {
          business_city: string
          business_latitude: number
          business_longitude: number
          business_name: string
          business_state: string
          delivery_radius_miles: number
          distance_miles: number
          id: string
        }[]
      }
      calculate_cbd_category: { Args: { cbd_value: number }; Returns: string }
      calculate_potency_category: {
        Args: { thc_value: number }
        Returns: string
      }
      calculate_thc_cbd_ratio: {
        Args: { cbd_value: number; thc_value: number }
        Returns: string
      }
      can_access_order_pii: { Args: { p_order_id: string }; Returns: boolean }
      cancel_order: {
        Args: { p_cancelled_by: string; p_order_id: string; p_reason?: string }
        Returns: Json
      }
      check_legal_boundary: {
        Args: { lat: number; lng: number }
        Returns: {
          cannabis_legal: boolean
          delivery_allowed: boolean
          jurisdiction: string
          jurisdiction_type: string
          max_possession_grams: number
          max_purchase_grams: number
          medical_only: boolean
          min_age: number
          notes: string
          operating_hours: Json
          pickup_allowed: boolean
          recreational_allowed: boolean
          restrictions: Json
          state_code: string
        }[]
      }
      check_legal_jurisdiction: {
        Args: { check_lat: number; check_lng: number }
        Returns: {
          delivery_allowed: boolean
          is_legal: boolean
          jurisdiction_name: string
          pickup_allowed: boolean
          restrictions: Json
        }[]
      }
      check_product_availability: {
        Args: { check_lat: number; check_lng: number; product_id_param: string }
        Returns: boolean
      }
      cleanup_daily_recommendation_queue: { Args: never; Returns: number }
      cleanup_deal_alert_notification_queue: { Args: never; Returns: number }
      cleanup_new_product_notification_queue: { Args: never; Returns: number }
      cleanup_old_notification_queue: { Args: never; Returns: undefined }
      confirm_order_payment: {
        Args: {
          p_confirmed_by: string
          p_order_id: string
          p_payment_reference?: string
        }
        Returns: Json
      }
      confirm_payment: {
        Args: {
          p_confirmed_by: string
          p_order_id: string
          p_payment_reference?: string
        }
        Returns: undefined
      }
      decrement_product_stock:
        | {
            Args: {
              p_order_id: string
              p_product_id: string
              p_quantity: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_changed_by?: string
              p_order_id?: string
              p_product_id: string
              p_quantity: number
            }
            Returns: Json
          }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
      dropgeometrytable:
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      find_service_areas: {
        Args: { check_lat: number; check_lng: number; service_type?: string }
        Returns: {
          business_id: string
          business_name: string
          delivery_fee: number
          distance_meters: number
          estimated_delivery_time: string
          minimum_order: number
          service_area_id: string
        }[]
      }
      generate_order_number: { Args: never; Returns: string }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
      get_config: { Args: { config_key: string }; Returns: string }
      get_due_notifications: {
        Args: { batch_size?: number }
        Returns: {
          body: string
          data: Json
          deep_link: string
          id: string
          image_url: string
          priority: number
          retry_count: number
          title: string
          type: string
          user_id: string
        }[]
      }
      get_low_stock_products: {
        Args: { p_business_id: string; p_threshold?: number }
        Returns: {
          category_id: string
          is_active: boolean
          product_id: string
          product_name: string
          stock_quantity: number
        }[]
      }
      get_notification_cron_status: {
        Args: never
        Returns: {
          active: boolean
          jobname: string
          schedule: string
        }[]
      }
      get_order_full_pii: {
        Args: { p_access_reason: string; p_order_id: string }
        Returns: {
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_city: string
          delivery_postal_code: string
          delivery_state: string
          id: string
        }[]
      }
      get_order_timeline: { Args: { p_order_id: string }; Returns: Json }
      get_order_with_history: { Args: { p_order_id: string }; Returns: Json }
      get_pending_daily_recommendations: {
        Args: { p_batch_size?: number }
        Returns: {
          id: string
          process_after: string
          scheduled_date: string
          user_id: string
        }[]
      }
      get_priority_notifications: {
        Args: { batch_size?: number }
        Returns: {
          body: string
          data: Json
          deep_link: string
          id: string
          image_url: string
          priority: number
          retry_count: number
          title: string
          type: string
          user_id: string
        }[]
      }
      get_product_brand_info: {
        Args: { p_product_id: string }
        Returns: {
          brand_id: string
          brand_logo_url: string
          brand_name: string
        }[]
      }
      get_product_inventory_history: {
        Args: { p_limit?: number; p_product_id: string }
        Returns: {
          change_type: string
          created_at: string
          id: string
          order_id: string
          quantity_after: number
          quantity_before: number
          quantity_change: number
          reason: string
        }[]
      }
      get_recent_searches: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string
          search_term: string
        }[]
      }
      get_recently_viewed_products: {
        Args: { p_limit?: number; p_user_id?: string }
        Returns: {
          last_viewed_at: string
          product_id: string
          view_count: number
        }[]
      }
      get_similar_users: {
        Args: { p_limit?: number; p_user_id?: string }
        Returns: {
          common_products_count: number
          similar_user_id: string
          similarity_score: number
        }[]
      }
      get_unread_notification_count: { Args: never; Returns: number }
      get_user_business_id: { Args: never; Returns: string }
      get_user_profile: { Args: { p_user_id?: string }; Returns: Json }
      get_user_review_for_product: {
        Args: { p_product_id: string; p_user_id?: string }
        Returns: {
          comment: string
          created_at: string
          helpful_count: number
          id: string
          is_verified_purchase: boolean
          rating: number
          title: string
          updated_at: string
        }[]
      }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_users_for_daily_recommendations: {
        Args: { p_scheduled_date: string }
        Returns: {
          process_after: string
          user_id: string
        }[]
      }
      gettransactionid: { Args: never; Returns: unknown }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_user_found_review_helpful: {
        Args: { p_review_id: string; p_user_id?: string }
        Returns: boolean
      }
      has_user_reviewed_product: {
        Args: { p_product_id: string; p_user_id?: string }
        Returns: boolean
      }
      increment_product_stock:
        | {
            Args: {
              p_order_id: string
              p_product_id: string
              p_quantity: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_changed_by?: string
              p_order_id?: string
              p_product_id: string
              p_quantity: number
            }
            Returns: Json
          }
      insert_notification_with_dedup: {
        Args: {
          p_body: string
          p_data: Json
          p_deep_link: string
          p_image_url: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: {
          notification_id: string
          skip_reason: string
          was_inserted: boolean
        }[]
      }
      is_admin: { Args: never; Returns: boolean }
      is_in_quiet_hours: { Args: { p_user_id: string }; Returns: boolean }
      log_pii_access: {
        Args: {
          p_access_reason?: string
          p_access_type: string
          p_order_id: string
          p_pii_fields: string[]
        }
        Returns: undefined
      }
      longtransactionsenabled: { Args: never; Returns: boolean }
      manually_process_notification_queues: { Args: never; Returns: Json }
      mark_all_notifications_as_read: { Args: never; Returns: undefined }
      mark_daily_rec_completed: {
        Args: {
          p_id: string
          p_notifications_queued: number
          p_products_checked: number
        }
        Returns: undefined
      }
      mark_daily_rec_failed: {
        Args: { p_error: string; p_id: string }
        Returns: undefined
      }
      mark_daily_rec_processing: { Args: { p_id: string }; Returns: undefined }
      mark_notification_as_clicked: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      mark_notification_as_dismissed: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
      mark_notification_as_read: {
        Args: { notification_id: string }
        Returns: undefined
      }
      populate_geometry_columns:
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
        | { Args: { use_typmod?: boolean }; Returns: string }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      process_new_product_notification_queue: {
        Args: { batch_size?: number }
        Returns: {
          failed: number
          processed: number
          total: number
        }[]
      }
      refresh_product_interaction_stats: { Args: never; Returns: undefined }
      refresh_recommendation_metrics: { Args: never; Returns: undefined }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
      st_askml:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geog: unknown }; Returns: number }
        | { Args: { geom: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
      track_user_interaction: {
        Args: {
          p_interaction_type: Database["public"]["Enums"]["interaction_type"]
          p_metadata?: Json
          p_product_id: string
          p_user_id: string
        }
        Returns: string
      }
      unlockrows: { Args: { "": string }; Returns: number }
      update_notification_delivery: {
        Args: {
          p_delivery_status: string
          p_fcm_message_id?: string
          p_notification_id: string
        }
        Returns: undefined
      }
      update_order_status: {
        Args: {
          p_new_status: Database["public"]["Enums"]["order_status"]
          p_notes?: string
          p_order_id: string
          p_reason?: string
          p_updated_by?: string
        }
        Returns: Json
      }
      update_user_profile: {
        Args: {
          p_avatar_url?: string
          p_bio?: string
          p_date_of_birth?: string
          p_display_name?: string
          p_notification_preferences?: Json
          p_phone_number?: string
          p_preferred_language?: string
          p_privacy_settings?: Json
          p_user_id: string
        }
        Returns: Json
      }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
      }
      validate_order_status_transition: {
        Args: {
          p_from_status: Database["public"]["Enums"]["order_status"]
          p_to_status: Database["public"]["Enums"]["order_status"]
          p_user_role?: string
        }
        Returns: boolean
      }
      verify_age: {
        Args: {
          p_birth_month: number
          p_birth_year: number
          p_has_medical_card?: boolean
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "business_owner"
        | "moderator"
        | "user"
        | "customer"
        | "brand_owner"
      application_status: "pending" | "approved" | "rejected"
      delivery_method: "delivery" | "pickup"
      document_type:
        | "owner_id"
        | "cannabis_license"
        | "resellers_permit"
        | "business_registration"
      interaction_type: "view" | "click" | "add_to_cart" | "purchase" | "share"
      jurisdiction_type: "city" | "county" | "state" | "federal"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
        | "pending_payment"
        | "in_transit"
        | "delivered"
      payment_method: "cash" | "debit" | "credit" | "etransfer" | "crypto"
      payment_status: "pending" | "confirmed" | "failed" | "refunded"
      retailer_type: "online" | "storefront" | "both"
      service_type: "delivery" | "pickup" | "both"
      user_role: "admin" | "business_owner"
    }
    CompositeTypes: {
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
      app_role: [
        "admin",
        "business_owner",
        "moderator",
        "user",
        "customer",
        "brand_owner",
      ],
      application_status: ["pending", "approved", "rejected"],
      delivery_method: ["delivery", "pickup"],
      document_type: [
        "owner_id",
        "cannabis_license",
        "resellers_permit",
        "business_registration",
      ],
      interaction_type: ["view", "click", "add_to_cart", "purchase", "share"],
      jurisdiction_type: ["city", "county", "state", "federal"],
      order_status: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
        "pending_payment",
        "in_transit",
        "delivered",
      ],
      payment_method: ["cash", "debit", "credit", "etransfer", "crypto"],
      payment_status: ["pending", "confirmed", "failed", "refunded"],
      retailer_type: ["online", "storefront", "both"],
      service_type: ["delivery", "pickup", "both"],
      user_role: ["admin", "business_owner"],
    },
  },
} as const
