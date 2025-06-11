// =============================================
// Database Types
// =============================================
// TypeScript types matching the Supabase database schema

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
        }
      }
      graphs: {
        Row: {
          id: string
          owner_id: string
          title: string
          data: GraphData
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          data: GraphData
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          data?: GraphData
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          user_id: string
          contact_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          contact_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          contact_id?: string
          created_at?: string
        }
      }
      shared_graphs: {
        Row: {
          id: string
          graph_id: string
          owner_id: string
          recipient_id: string
          shared_at: string
          graph_data_snapshot: GraphData
        }
        Insert: {
          id?: string
          graph_id: string
          owner_id: string
          recipient_id: string
          shared_at?: string
          graph_data_snapshot: GraphData
        }
        Update: {
          id?: string
          graph_id?: string
          owner_id?: string
          recipient_id?: string
          shared_at?: string
          graph_data_snapshot?: GraphData
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      get_admin_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// =============================================
// React Flow Types
// =============================================
// Types for the graph data structure (React Flow format)

export interface GraphNode {
  id: string
  position: {
    x: number
    y: number
  }
  data: {
    label: string
    [key: string]: any
  }
  type?: string
  style?: Record<string, any>
  className?: string
  sourcePosition?: 'top' | 'right' | 'bottom' | 'left'
  targetPosition?: 'top' | 'right' | 'bottom' | 'left'
  hidden?: boolean
  selected?: boolean
  dragging?: boolean
  width?: number
  height?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type?: string
  animated?: boolean
  style?: Record<string, any>
  className?: string
  sourceHandle?: string
  targetHandle?: string
  hidden?: boolean
  selected?: boolean
  data?: Record<string, any>
}

export interface GraphViewport {
  x: number
  y: number
  zoom: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  viewport?: GraphViewport
}

// =============================================
// Application Types
// =============================================
// Higher-level types for the application

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Graph = Database['public']['Tables']['graphs']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type SharedGraph = Database['public']['Tables']['shared_graphs']['Row']

export type InsertProfile = Database['public']['Tables']['profiles']['Insert']
export type InsertGraph = Database['public']['Tables']['graphs']['Insert']
export type InsertContact = Database['public']['Tables']['contacts']['Insert']
export type InsertSharedGraph = Database['public']['Tables']['shared_graphs']['Insert']

export type UpdateProfile = Database['public']['Tables']['profiles']['Update']
export type UpdateGraph = Database['public']['Tables']['graphs']['Update']
export type UpdateContact = Database['public']['Tables']['contacts']['Update']
export type UpdateSharedGraph = Database['public']['Tables']['shared_graphs']['Update']

// Contact with profile information
export interface ContactWithProfile extends Contact {
  profile: Profile
}

// Graph with sharing information
export interface GraphWithSharing extends Graph {
  shared_with?: string[]
  is_shared?: boolean
}

// Shared graph with owner and graph information
export interface SharedGraphWithDetails extends SharedGraph {
  owner_profile: Profile
  graph_title: string
}
