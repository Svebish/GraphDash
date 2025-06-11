-- =============================================
-- Sample Data and Test Queries
-- =============================================
-- Use this for testing the database schema and policies

-- Sample graph data (React Flow format)
-- This is what a typical graph data structure looks like
/*
{
  "nodes": [
    {
      "id": "1",
      "position": { "x": 0, "y": 0 },
      "data": { "label": "Node 1" },
      "type": "default"
    },
    {
      "id": "2", 
      "position": { "x": 100, "y": 100 },
      "data": { "label": "Node 2" },
      "type": "default"
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "type": "default"
    }
  ],
  "viewport": {
    "x": 0,
    "y": 0,
    "zoom": 1
  }
}
*/

-- Test queries to verify the schema works correctly:

-- 1. Create a test graph (replace user_id with actual UUID)
/*
INSERT INTO graphs (owner_id, title, data) VALUES (
    'user-uuid-here',
    'My First Graph',
    '{
        "nodes": [
            {"id": "1", "position": {"x": 0, "y": 0}, "data": {"label": "Start"}, "type": "default"},
            {"id": "2", "position": {"x": 200, "y": 0}, "data": {"label": "End"}, "type": "default"}
        ],
        "edges": [
            {"id": "e1-2", "source": "1", "target": "2", "type": "default"}
        ],
        "viewport": {"x": 0, "y": 0, "zoom": 1}
    }'::jsonb
);
*/

-- 2. Add a contact relationship
/*
INSERT INTO contacts (user_id, contact_id) VALUES (
    'user1-uuid-here',
    'user2-uuid-here'
);
*/

-- 3. Share a graph
/*
INSERT INTO shared_graphs (graph_id, owner_id, recipient_id, graph_data_snapshot) 
SELECT 
    g.id,
    g.owner_id,
    'recipient-uuid-here',
    g.data
FROM graphs g 
WHERE g.id = 'graph-uuid-here';
*/

-- Useful test queries:

-- Get all graphs for a user
-- SELECT * FROM graphs WHERE owner_id = auth.uid();

-- Get all shared graphs for a user  
-- SELECT * FROM shared_graphs WHERE recipient_id = auth.uid();

-- Get user's contacts with profile info
-- SELECT c.*, p.username FROM contacts c 
-- JOIN profiles p ON c.contact_id = p.id 
-- WHERE c.user_id = auth.uid();

-- Get graph with sharing info
-- SELECT g.*, 
--        array_agg(sg.recipient_id) as shared_with
-- FROM graphs g
-- LEFT JOIN shared_graphs sg ON g.id = sg.graph_id
-- WHERE g.owner_id = auth.uid()
-- GROUP BY g.id;
