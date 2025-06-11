import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Position,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
  type NodeChange,
  type EdgeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Toolbar } from './Toolbar'
import nodeTypes from './CustomNodes'
import type { GraphData, GraphNode, GraphEdge } from '../../types/database'
import { createGraph, updateGraph, getGraph } from '../../lib/database'
import { useAuth } from '../../hooks/useAuth'

// Utility functions to convert between GraphNode/GraphEdge and React Flow types
const convertToReactFlowNode = (node: GraphNode): Node => ({
  ...node,
  sourcePosition: node.sourcePosition as Position,
  targetPosition: node.targetPosition as Position,
})

const convertToReactFlowEdge = (edge: GraphEdge): Edge => ({
  ...edge,
  sourceHandle: edge.sourceHandle || null,
  targetHandle: edge.targetHandle || null,
})

const convertFromReactFlowNode = (node: Node): GraphNode => ({
  ...node,
  sourcePosition: node.sourcePosition,
  targetPosition: node.targetPosition,
  width: node.width || undefined,
  height: node.height || undefined,
})

const convertFromReactFlowEdge = (edge: Edge): GraphEdge => ({
  ...edge,
  sourceHandle: edge.sourceHandle || undefined,
  targetHandle: edge.targetHandle || undefined,
})

interface GraphEditorProps {
  graphId?: string
  onSave?: (graphData: GraphData) => void
  readOnly?: boolean
}

export function GraphEditor({ graphId, onSave, readOnly = false }: GraphEditorProps) {
  const { user } = useAuth()
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [graphTitle, setGraphTitle] = useState('Untitled Graph')
  const [isNewGraph, setIsNewGraph] = useState(!graphId)
  const [nodeType, setNodeType] = useState('default')
  
  // Auto-save functionality
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load graph data if graphId is provided
  useEffect(() => {
    if (graphId && user) {
      loadGraph()
    }
  }, [graphId, user])

  const loadGraph = async () => {
    if (!graphId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const graph = await getGraph(graphId)
      if (graph) {
        setGraphTitle(graph.title)
        if (graph.data.nodes) {
          const reactFlowNodes = graph.data.nodes.map(convertToReactFlowNode)
          setNodes(reactFlowNodes)
        }
        if (graph.data.edges) {
          const reactFlowEdges = graph.data.edges.map(convertToReactFlowEdge)
          setEdges(reactFlowEdges)
        }
        if (graph.data.viewport && reactFlowInstance) {
          reactFlowInstance.setViewport(graph.data.viewport)
        }
        setIsNewGraph(false)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load graph')
    } finally {
      setLoading(false)
    }
  }

  // Auto-save with debouncing
  const triggerAutoSave = useCallback(() => {
    if (readOnly || !user) return
    
    setHasUnsavedChanges(true)
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current)
    }
    
    autoSaveTimer.current = setTimeout(() => {
      saveGraph()
    }, 2000) // Auto-save after 2 seconds of inactivity
  }, [readOnly, user, nodes, edges, reactFlowInstance])

  // Save graph data
  const saveGraph = async () => {
    if (!user || readOnly) return
    
    setSaving(true)
    setError(null)
    
    try {
      const viewport = reactFlowInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
      const graphData: GraphData = {
        nodes: nodes.map(convertFromReactFlowNode),
        edges: edges.map(convertFromReactFlowEdge),
        viewport
      }
      
      if (isNewGraph) {
        const newGraph = await createGraph({
          owner_id: user.id,
          title: graphTitle,
          data: graphData
        })
        if (newGraph) {
          setIsNewGraph(false)
          // Could update URL here if using routing
        }
      } else if (graphId) {
        await updateGraph(graphId, {
          title: graphTitle,
          data: graphData
        })
      }
      
      setHasUnsavedChanges(false)
      onSave?.(graphData)
    } catch (err: any) {
      setError(err.message || 'Failed to save graph')
    } finally {
      setSaving(false)
    }
  }

  // Handle node changes with auto-save trigger
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
      triggerAutoSave()
    },
    [onNodesChange, triggerAutoSave]
  )

  // Handle edge changes with auto-save trigger
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes)
      triggerAutoSave()
    },
    [onEdgesChange, triggerAutoSave]
  )

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (readOnly) return
      setEdges((eds) => addEdge(params, eds))
      triggerAutoSave()
    },
    [setEdges, triggerAutoSave, readOnly]
  )

  // Add new node
  const addNode = useCallback(() => {
    if (readOnly) return
    
    const newNode: Node = {
      id: `node_${Date.now()}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} ${nodes.length + 1}` },
      type: nodeType,
    }
    
    setNodes((nds) => [...nds, newNode])
    triggerAutoSave()
  }, [nodes.length, setNodes, triggerAutoSave, readOnly, nodeType])

  // Delete selected elements
  const deleteSelected = useCallback(() => {
    if (readOnly) return
    
    setNodes((nds) => nds.filter((node) => !node.selected))
    setEdges((eds) => eds.filter((edge) => !edge.selected))
    triggerAutoSave()
  }, [setNodes, setEdges, triggerAutoSave, readOnly])

  // Clear all nodes and edges
  const clearGraph = useCallback(() => {
    if (readOnly) return
    
    setNodes([])
    setEdges([])
    triggerAutoSave()
  }, [setNodes, setEdges, triggerAutoSave, readOnly])

  // Generate sample data for testing
  const generateSampleData = useCallback(() => {
    if (readOnly) return
    
    const sampleNodes: Node[] = [
      {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Start Node' },
      },
      {
        id: '2',
        position: { x: 300, y: 100 },
        data: { label: 'Process Node' },
      },
      {
        id: '3',
        position: { x: 500, y: 100 },
        data: { label: 'End Node' },
      },
    ]
    
    const sampleEdges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        animated: true,
      },
    ]
    
    setNodes(sampleNodes)
    setEdges(sampleEdges)
    triggerAutoSave()
  }, [setNodes, setEdges, triggerAutoSave, readOnly])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <Toolbar
        onAddNode={addNode}
        onDeleteSelected={deleteSelected}
        onClearGraph={clearGraph}
        onSave={saveGraph}
        onGenerateSample={generateSampleData}
        saving={saving}
        readOnly={readOnly}
        hasUnsavedChanges={hasUnsavedChanges}
        nodeType={nodeType}
        onNodeTypeChange={setNodeType}
        graphTitle={graphTitle}
        onGraphTitleChange={(title) => {
          setGraphTitle(title)
          triggerAutoSave()
        }}
      />

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Graph Editor */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Status bar */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex justify-between">
        <div>
          Nodes: {nodes.length} | Edges: {edges.length}
        </div>
        <div>
          {readOnly && <span className="text-orange-600">Read Only</span>}
          {!user && <span className="text-red-600">Not authenticated</span>}
        </div>
      </div>
    </div>
  )
}

// Wrapper component with ReactFlowProvider
export function GraphEditorWithProvider(props: GraphEditorProps) {
  return (
    <ReactFlowProvider>
      <GraphEditor {...props} />
    </ReactFlowProvider>
  )
}
