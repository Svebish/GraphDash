-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================
-- Run this after creating the tables to enforce security rules

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_graphs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES TABLE POLICIES
-- =============================================

-- All authenticated users can view all profiles (for contact search)
CREATE POLICY "Public profiles are viewable by authenticated users" 
    ON profiles FOR SELECT 
    TO authenticated 
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
    ON profiles FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- =============================================
-- GRAPHS TABLE POLICIES
-- =============================================

-- Users can view their own graphs
CREATE POLICY "Users can view their own graphs" 
    ON graphs FOR SELECT 
    TO authenticated 
    USING (auth.uid() = owner_id);

-- Users can insert their own graphs
CREATE POLICY "Users can insert their own graphs" 
    ON graphs FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = owner_id);

-- Users can update their own graphs
CREATE POLICY "Users can update their own graphs" 
    ON graphs FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- Users can delete their own graphs
CREATE POLICY "Users can delete their own graphs" 
    ON graphs FOR DELETE 
    TO authenticated 
    USING (auth.uid() = owner_id);

-- =============================================
-- CONTACTS TABLE POLICIES
-- =============================================

-- Users can view their own contacts
CREATE POLICY "Users can view their own contacts" 
    ON contacts FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id);

-- Users can add contacts to their own list
CREATE POLICY "Users can insert their own contacts" 
    ON contacts FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = user_id);

-- Users can remove contacts from their own list
CREATE POLICY "Users can delete their own contacts" 
    ON contacts FOR DELETE 
    TO authenticated 
    USING (auth.uid() = user_id);

-- =============================================
-- SHARED_GRAPHS TABLE POLICIES
-- =============================================

-- Users can view graphs shared with them
CREATE POLICY "Users can view graphs shared with them" 
    ON shared_graphs FOR SELECT 
    TO authenticated 
    USING (auth.uid() = recipient_id);

-- Users can share their own graphs (owner can insert)
CREATE POLICY "Users can share their own graphs" 
    ON shared_graphs FOR INSERT 
    TO authenticated 
    WITH CHECK (auth.uid() = owner_id);

-- Recipients can delete shared graphs they received
CREATE POLICY "Recipients can remove shared graphs" 
    ON shared_graphs FOR DELETE 
    TO authenticated 
    USING (auth.uid() = recipient_id);

-- Owners can delete shared graphs they created
CREATE POLICY "Owners can remove their shared graphs" 
    ON shared_graphs FOR DELETE 
    TO authenticated 
    USING (auth.uid() = owner_id);
