export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: number
          name: string
          category_id: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          category_id: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          category_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tasks: {
        Row: {
          id: number
          user_id: string
          task_id: number
          completed: boolean
          scheduled_for: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          task_id: number
          completed?: boolean
          scheduled_for?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          task_id?: number
          completed?: boolean
          scheduled_for?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          username: string
          avatar_url: string | null
          phone: string | null
          created_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          username: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          username?: string
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
  }
}

