import { useState } from 'react'
import { Button } from '../ui/Button'
import type { Graph, SharedGraphWithDetails } from '../../types/database'

interface GraphCardProps {
  graph: Graph | SharedGraphWithDetails
  type: 'owned' | 'shared'
  onEdit?: (graphId: string) => void
  onDelete?: (graphId: string) => void
  onRemoveShared?: (sharedId: string) => void
  onView?: (graphId: string) => void
}

export function GraphCard({ 
  graph, 
  type, 
  onEdit, 
  onDelete, 
  onRemoveShared, 
  onView 
}: GraphCardProps) {
  const [loading, setLoading] = useState(false)

  const isSharedGraph = type === 'shared'
  const title = isSharedGraph 
    ? (graph as SharedGraphWithDetails).graph_title 
    : (graph as Graph).title

  const handleEdit = async () => {
    if (!onEdit) return
    setLoading(true)
    try {
      onEdit(graph.id)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!confirm('Are you sure you want to delete this graph? This action cannot be undone.')) {
      return
    }
    
    setLoading(true)
    try {
      onDelete(graph.id)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveShared = async () => {
    if (!onRemoveShared || !isSharedGraph) return
    if (!confirm('Remove this shared graph from your dashboard?')) {
      return
    }
    
    setLoading(true)
    try {
      onRemoveShared((graph as SharedGraphWithDetails).id)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async () => {
    if (!onView) return
    setLoading(true)
    try {
      onView(isSharedGraph ? (graph as SharedGraphWithDetails).graph_id : graph.id)
    } finally {
      setLoading(false)
    }
  }

  const nodeCount = isSharedGraph 
    ? (graph as SharedGraphWithDetails).graph_data_snapshot?.nodes?.length || 0
    : (graph as Graph).data?.nodes?.length || 0
  
  const edgeCount = isSharedGraph 
    ? (graph as SharedGraphWithDetails).graph_data_snapshot?.edges?.length || 0
    : (graph as Graph).data?.edges?.length || 0

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {title}
            </h3>
            {isSharedGraph && (
              <p className="text-sm text-gray-500">
                Shared by {(graph as SharedGraphWithDetails).owner_profile?.username || 'Unknown'}
              </p>
            )}
          </div>
          
          {isSharedGraph ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Shared
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Owned
            </span>
          )}
        </div>

        {/* Graph Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{nodeCount}</div>
            <div className="text-sm text-gray-600">Nodes</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{edgeCount}</div>
            <div className="text-sm text-gray-600">Edges</div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="text-xs text-gray-500 mb-4">
          {isSharedGraph ? (
            <div>
              <div>Shared: {new Date((graph as SharedGraphWithDetails).shared_at).toLocaleDateString()}</div>
            </div>
          ) : (
            <div>
              <div>Created: {new Date((graph as Graph).created_at).toLocaleDateString()}</div>
              <div>Updated: {new Date((graph as Graph).updated_at).toLocaleDateString()}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleView}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Loading...' : 'View'}
          </Button>
          
          {!isSharedGraph && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                disabled={loading}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
              >
                Delete
              </Button>
            </>
          )}
          
          {isSharedGraph && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleRemoveShared}
              disabled={loading}
              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GraphCard
