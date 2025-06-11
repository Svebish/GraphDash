-- =============================================
-- GraphDash Database Schema
-- =============================================
-- This file contains the complete database schema for GraphDash
-- Run this in your Supabase SQL editor after creating a new project

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLES
-- =============================================

-- Table: profiles
-- Links to Supabase auth.users for public profile information
CREATE TABLE profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: graphs  
-- Stores user-created graphs with React Flow data
CREATE TABLE graphs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Table: contacts
-- Manages user contact lists (many-to-many relationship)
CREATE TABLE contacts (
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contact_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, contact_id),
    CONSTRAINT contacts_no_self_reference CHECK (user_id != contact_id)
);

-- Table: shared_graphs
-- Tracks static graph sharing between users
CREATE TABLE shared_graphs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    graph_id uuid REFERENCES graphs(id) ON DELETE CASCADE NOT NULL,
    owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    shared_at timestamp with time zone DEFAULT now(),
    graph_data_snapshot jsonb NOT NULL,
    CONSTRAINT shared_graphs_no_self_share CHECK (owner_id != recipient_id)
);

-- =============================================
-- INDEXES (for performance)
-- =============================================

-- Indexes for better query performance
CREATE INDEX idx_graphs_owner_id ON graphs(owner_id);
CREATE INDEX idx_graphs_updated_at ON graphs(updated_at DESC);
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_contact_id ON contacts(contact_id);
CREATE INDEX idx_shared_graphs_recipient_id ON shared_graphs(recipient_id);
CREATE INDEX idx_shared_graphs_owner_id ON shared_graphs(owner_id);
CREATE INDEX idx_shared_graphs_graph_id ON shared_graphs(graph_id);

-- =============================================
-- TRIGGERS
-- =============================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at for graphs
CREATE TRIGGER update_graphs_updated_at 
    BEFORE UPDATE ON graphs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
