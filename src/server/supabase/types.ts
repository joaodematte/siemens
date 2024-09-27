import { SupabaseClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      inverter: {
        Row: {
          active_power: number;
          created_at: string;
          created_by: string;
          id: string;
          manufacturer_id: string;
          model: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          active_power: number;
          created_at?: string;
          created_by?: string;
          id?: string;
          manufacturer_id: string;
          model: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          active_power?: number;
          created_at?: string;
          created_by?: string;
          id?: string;
          manufacturer_id?: string;
          model?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inverter_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inverter_manufacturer_id_fkey';
            columns: ['manufacturer_id'];
            isOneToOne: false;
            referencedRelation: 'manufacturer';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'inverter_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
      manufacturer: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
          type: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name: string;
          type: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
          type?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'manufacturer_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'manufacturer_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
      panel: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          manufacturer_id: string;
          model: string;
          power: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          id?: string;
          manufacturer_id: string;
          model: string;
          power: number;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          manufacturer_id?: string;
          model?: string;
          power?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'panel_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'panel_manufacturer_id_fkey';
            columns: ['manufacturer_id'];
            isOneToOne: false;
            referencedRelation: 'manufacturer';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'panel_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
      profile: {
        Row: {
          first_name: string;
          id: string;
          last_name: string;
        };
        Insert: {
          first_name: string;
          id: string;
          last_name: string;
        };
        Update: {
          first_name?: string;
          id?: string;
          last_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      single_line_diagram: {
        Row: {
          circuit_breaker_capacity: number;
          connection_type: string;
          consumer_unit: string;
          created_at: string;
          created_by: string;
          id: string;
          inverter_model: string;
          panel_model: string;
          panel_power: string;
          panels_amount: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          circuit_breaker_capacity: number;
          connection_type: string;
          consumer_unit: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          inverter_model: string;
          panel_model: string;
          panel_power: string;
          panels_amount: number;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          circuit_breaker_capacity?: number;
          connection_type?: string;
          consumer_unit?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          inverter_model?: string;
          panel_model?: string;
          panel_power?: string;
          panels_amount?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'single_line_diagram_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'single_line_diagram_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profile';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends (
    { schema: keyof Database }
  ) ?
    keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])
  : never = never
> =
  PublicTableNameOrOptions extends { schema: keyof Database } ?
    (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends (
      {
        Row: infer R;
      }
    ) ?
      R
    : never
  : PublicTableNameOrOptions extends (
    keyof (PublicSchema['Tables'] & PublicSchema['Views'])
  ) ?
    (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends (
      {
        Row: infer R;
      }
    ) ?
      R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends (
    { schema: keyof Database }
  ) ?
    keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never
> =
  PublicTableNameOrOptions extends { schema: keyof Database } ?
    Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends (
      {
        Insert: infer I;
      }
    ) ?
      I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables'] ?
    PublicSchema['Tables'][PublicTableNameOrOptions] extends (
      {
        Insert: infer I;
      }
    ) ?
      I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends (
    { schema: keyof Database }
  ) ?
    keyof Database[PublicTableNameOrOptions['schema']]['Tables']
  : never = never
> =
  PublicTableNameOrOptions extends { schema: keyof Database } ?
    Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends (
      {
        Update: infer U;
      }
    ) ?
      U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables'] ?
    PublicSchema['Tables'][PublicTableNameOrOptions] extends (
      {
        Update: infer U;
      }
    ) ?
      U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database } ?
    keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
  : never = never
> =
  PublicEnumNameOrOptions extends { schema: keyof Database } ?
    Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] ?
    PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;

export type Client = SupabaseClient<Database>;

export type Inverter = Tables<'inverter'>;
export type Manufacturer = Tables<'manufacturer'>;
export type Panel = Tables<'panel'>;
export type SingleLineDiagram = Tables<'single_line_diagram'>;
export type Profile = Tables<'profile'>;
