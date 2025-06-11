// =============================================
// Database Operations
// =============================================
// Utility functions for common database operations

import { supabase } from './supabase'
import type { 
  Profile, 
  Graph, 
  Contact, 
  SharedGraph,
  InsertGraph,
  InsertContact,
  InsertSharedGraph,
  UpdateGraph,
  ContactWithProfile,
  SharedGraphWithDetails
} from '../types/database'

// =============================================
// Profile Operations
// =============================================

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export async function updateUserProfile(updates: { username?: string }): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}

export async function searchProfiles(query: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', `%${query}%`)
    .limit(10)

  if (error) {
    console.error('Error searching profiles:', error)
    return []
  }

  return data || []
}

// =============================================
// Graph Operations
// =============================================

export async function getUserGraphs(): Promise<Graph[]> {
  const { data, error } = await supabase
    .from('graphs')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching user graphs:', error)
    return []
  }

  return data || []
}

export async function getGraph(id: string): Promise<Graph | null> {
  const { data, error } = await supabase
    .from('graphs')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching graph:', error)
    return null
  }

  return data
}

export async function createGraph(graph: InsertGraph): Promise<Graph | null> {
  const { data, error } = await supabase
    .from('graphs')
    .insert(graph)
    .select()
    .single()

  if (error) {
    console.error('Error creating graph:', error)
    return null
  }

  return data
}

export async function updateGraph(id: string, updates: UpdateGraph): Promise<Graph | null> {
  const { data, error } = await supabase
    .from('graphs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating graph:', error)
    return null
  }

  return data
}

export async function deleteGraph(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('graphs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting graph:', error)
    return false
  }

  return true
}

// =============================================
// Contact Operations
// =============================================

export async function getUserContacts(): Promise<ContactWithProfile[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      profile:profiles!contacts_contact_id_fkey (*)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }

  return data || []
}

export async function addContact(contactId: string): Promise<Contact | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const contact: InsertContact = {
    user_id: user.id,
    contact_id: contactId
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single()

  if (error) {
    console.error('Error adding contact:', error)
    return null
  }

  return data
}

export async function removeContact(contactId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('user_id', user.id)
    .eq('contact_id', contactId)

  if (error) {
    console.error('Error removing contact:', error)
    return false
  }

  return true
}

// =============================================
// Graph Sharing Operations
// =============================================

export async function shareGraph(graphId: string, recipientId: string): Promise<SharedGraph | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // First, get the current graph data
  const graph = await getGraph(graphId)
  if (!graph) return null

  const sharedGraph: InsertSharedGraph = {
    graph_id: graphId,
    owner_id: user.id,
    recipient_id: recipientId,
    graph_data_snapshot: graph.data
  }

  const { data, error } = await supabase
    .from('shared_graphs')
    .insert(sharedGraph)
    .select()
    .single()

  if (error) {
    console.error('Error sharing graph:', error)
    return null
  }

  return data
}

export async function getSharedGraphs(): Promise<SharedGraphWithDetails[]> {
  const { data, error } = await supabase
    .from('shared_graphs')
    .select(`
      *,
      owner_profile:profiles!shared_graphs_owner_id_fkey (username),
      graph:graphs!shared_graphs_graph_id_fkey (title)
    `)
    .order('shared_at', { ascending: false })

  if (error) {
    console.error('Error fetching shared graphs:', error)
    return []
  }

  // Transform the data to match our expected type
  return (data || []).map(item => ({
    ...item,
    owner_profile: item.owner_profile as Profile,
    graph_title: (item.graph as any)?.title || 'Untitled Graph'
  }))
}

export async function removeSharedGraph(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('shared_graphs')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error removing shared graph:', error)
    return false
  }

  return true
}
