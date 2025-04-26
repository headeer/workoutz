export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      exercise_progress: {
        Row: {
          created_at: string
          date: string
          duration: string | null
          exercise_id: number | null
          id: number
          notes: string | null
          reps: number | null
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          duration?: string | null
          exercise_id?: number | null
          id?: number
          notes?: string | null
          reps?: number | null
          user_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          duration?: string | null
          exercise_id?: number | null
          id?: number
          notes?: string | null
          reps?: number | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_sets: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          exercise_id: number | null
          id: number
          is_completed: boolean | null
          points: number | null
          reps: string | null
          rest_time: number | null
          set_number: number
          weight: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          exercise_id?: number | null
          id?: number
          is_completed?: boolean | null
          points?: number | null
          reps?: string | null
          rest_time?: number | null
          set_number: number
          weight?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          exercise_id?: number | null
          id?: number
          is_completed?: boolean | null
          points?: number | null
          reps?: string | null
          rest_time?: number | null
          set_number?: number
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          description: string | null
          duration: string | null
          id: number
          is_completed: boolean | null
          name: string
          notes: string | null
          order_index: number
          points: number | null
          reps: string | null
          rest_time: number | null
          section_id: number | null
          sets: number | null
          video_url: string | null
          weight: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          is_completed?: boolean | null
          name: string
          notes?: string | null
          order_index: number
          points?: number | null
          reps?: string | null
          rest_time?: number | null
          section_id?: number | null
          sets?: number | null
          video_url?: string | null
          weight?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: number
          is_completed?: boolean | null
          name?: string
          notes?: string | null
          order_index?: number
          points?: number | null
          reps?: string | null
          rest_time?: number | null
          section_id?: number | null
          sets?: number | null
          video_url?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "workout_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_bests: {
        Row: {
          achieved_at: string | null
          exercise_id: number | null
          id: string
          notes: string | null
          reps: number | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          achieved_at?: string | null
          exercise_id?: number | null
          id?: string
          notes?: string | null
          reps?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          achieved_at?: string | null
          exercise_id?: number | null
          id?: string
          notes?: string | null
          reps?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_bests_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_days: number | null
          completed_exercises: number | null
          completed_weeks: number | null
          created_at: string
          id: number
          level: number | null
          points: number | null
          streak_days: number | null
          total_workouts: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_days?: number | null
          completed_exercises?: number | null
          completed_weeks?: number | null
          created_at?: string
          id?: number
          level?: number | null
          points?: number | null
          streak_days?: number | null
          total_workouts?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_days?: number | null
          completed_exercises?: number | null
          completed_weeks?: number | null
          created_at?: string
          id?: number
          level?: number | null
          points?: number | null
          streak_days?: number | null
          total_workouts?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_sections: {
        Row: {
          created_at: string
          description: string | null
          id: number
          order_index: number
          title: string
          workout_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          order_index: number
          title: string
          workout_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          order_index?: number
          title?: string
          workout_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sections_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_stats: {
        Row: {
          average_exercises_per_workout: number | null
          favorite_exercises: string[] | null
          last_workout_date: string | null
          monthly_workouts: number | null
          preferred_days: string[] | null
          updated_at: string | null
          user_id: string
          weekly_workouts: number | null
        }
        Insert: {
          average_exercises_per_workout?: number | null
          favorite_exercises?: string[] | null
          last_workout_date?: string | null
          monthly_workouts?: number | null
          preferred_days?: string[] | null
          updated_at?: string | null
          user_id: string
          weekly_workouts?: number | null
        }
        Update: {
          average_exercises_per_workout?: number | null
          favorite_exercises?: string[] | null
          last_workout_date?: string | null
          monthly_workouts?: number | null
          preferred_days?: string[] | null
          updated_at?: string | null
          user_id?: string
          weekly_workouts?: number | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          day_trigger: string
          id: number
          name: string
          user_name: string
        }
        Insert: {
          created_at?: string
          day_trigger: string
          id?: number
          name: string
          user_name: string
        }
        Update: {
          created_at?: string
          day_trigger?: string
          id?: number
          name?: string
          user_name?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

