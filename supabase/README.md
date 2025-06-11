# Supabase Backend Setup Guide

This guide walks you through setting up the Supabase backend for GraphDash.

## Prerequisites

1. Create a [Supabase account](https://supabase.com)
2. Install [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local development)

## Step 1: Create a New Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: GraphDash
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be provisioned (2-3 minutes)

## Step 2: Configure Environment Variables

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy your project URL and anon public key
3. In your GraphDash project, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL files in order:

### 3.1 Create Tables and Triggers
Copy and run the contents of `supabase/schema.sql`:
- Creates all required tables (profiles, graphs, contacts, shared_graphs)
- Sets up indexes for performance
- Creates triggers for automatic profile creation and timestamp updates

### 3.2 Enable Row Level Security
Copy and run the contents of `supabase/policies.sql`:
- Enables RLS on all tables
- Creates security policies for each table
- Ensures users can only access their own data

### 3.3 Set Up Admin Functions (Optional)
Copy and run the contents of `supabase/admin-functions.sql`:
- Creates helper functions for admin operations
- Note: You'll need to update the admin user UUID after creating the admin account

## Step 4: Create Admin User (Optional)

If you want admin functionality:

1. Go to **Authentication > Users** in your Supabase dashboard
2. Click "Add user"
3. Create user with:
   - **Email**: admin@yourdomain.com
   - **Password**: ratchurch (or your preferred admin password)
   - **Auto Confirm User**: ✓
4. Copy the user's UUID from the users table
5. Update the admin functions in `supabase/admin-functions.sql` with the actual UUID
6. Re-run the admin functions SQL

## Step 5: Configure Authentication

1. Go to **Authentication > Settings** in Supabase
2. Under **Site URL**, add your development and production URLs:
   - `http://localhost:5173` (for development)
   - Your production domain (when deployed)
3. Under **Auth Providers**, configure as needed:
   - Email auth is enabled by default
   - Optionally enable OAuth providers (Google, GitHub, etc.)

## Step 6: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:5173`
3. The app should connect to Supabase without errors
4. Check browser console for any connection issues

## Step 7: Verify Database Operations

You can test the database setup by running some queries in the Supabase SQL Editor:

### Check if tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'graphs', 'contacts', 'shared_graphs');
```

### Check RLS policies:
```sql
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Test profile creation trigger:
The trigger should automatically create a profile when a user signs up through your app.

## Database Schema Overview

### Tables Created:

1. **profiles**: User profile information
   - Links to `auth.users`
   - Stores public username
   - Auto-created on user signup

2. **graphs**: User-created graphs
   - Stores React Flow data as JSONB
   - Tracks creation and update timestamps
   - Owned by users

3. **contacts**: User contact relationships
   - Many-to-many relationship between users
   - Prevents self-references

4. **shared_graphs**: Static graph sharing
   - Links graphs to recipients
   - Stores snapshot of graph data at time of sharing
   - Prevents self-sharing

### Security Features:

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Contacts are visible to enable searching
- Shared graphs are accessible to recipients
- Automatic profile creation on user signup

## Troubleshooting

### Common Issues:

1. **Connection errors**: Check environment variables match your Supabase project
2. **RLS errors**: Ensure policies are created and user is authenticated
3. **Profile creation fails**: Check if the trigger function was created properly
4. **Queries fail**: Verify table names and column names match the schema

### Useful SQL Queries for Debugging:

```sql
-- Check if user has a profile
SELECT * FROM profiles WHERE id = auth.uid();

-- View all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check table structure
\d+ profiles
\d+ graphs  
\d+ contacts
\d+ shared_graphs
```

## Next Steps

After completing this setup:

1. ✅ Backend is ready for development
2. ➡️ Proceed to Task 3: Implement User Authentication
3. ➡️ Start building the frontend components

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL JSONB Documentation](https://www.postgresql.org/docs/current/datatype-json.html)
