import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { GraphCard } from '../components/ui/GraphCard'
import { GraphEditorWithProvider } from '../components/editor/GraphEditor'
import { getUserGraphs, getSharedGraphs, deleteGraph, removeSharedGraph } from '../lib/database'
import type { Graph, SharedGraphWithDetails } from '../types/database'

type TabType = 'graphs' | 'shared' | 'contacts'

export function DashboardPage() {
  const { user, profile, signOut } = useAuth()
  const [showGraphEditor, setShowGraphEditor] = useState(false)
  const [editingGraphId, setEditingGraphId] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState<TabType>('graphs')
  const [userGraphs, setUserGraphs] = useState<Graph[]>([])
  const [sharedGraphs, setSharedGraphs] = useState<SharedGraphWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data when component mounts or active tab changes
  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (activeTab === 'graphs') {
        const graphs = await getUserGraphs()
        setUserGraphs(graphs)
      } else if (activeTab === 'shared') {
        const shared = await getSharedGraphs()
        setSharedGraphs(shared)
      }
      // contacts will be implemented later
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleCreateGraph = () => {
    setEditingGraphId(undefined)
    setShowGraphEditor(true)
  }

  const handleEditGraph = (graphId: string) => {
    setEditingGraphId(graphId)
    setShowGraphEditor(true)
  }

  const handleViewGraph = (graphId: string) => {
    setEditingGraphId(graphId)
    setShowGraphEditor(true)
  }

  const handleDeleteGraph = async (graphId: string) => {
    const success = await deleteGraph(graphId)
    if (success) {
      setUserGraphs(prev => prev.filter(g => g.id !== graphId))
    }
  }

  const handleRemoveSharedGraph = async (sharedId: string) => {
    const success = await removeSharedGraph(sharedId)
    if (success) {
      setSharedGraphs(prev => prev.filter(g => g.id !== sharedId))
    }
  }

  const handleGraphSaved = () => {
    // Refresh the current tab's data after saving
    loadData()
    setShowGraphEditor(false)
    setEditingGraphId(undefined)
  }

  if (showGraphEditor) {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">GraphDash</h1>
                <span className="ml-4 text-sm text-gray-500">Graph Editor</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGraphEditor(false)}
                >
                  Back to Dashboard
                </Button>
                <span className="text-sm text-gray-600">
                  Welcome, {profile?.username || user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Graph Editor */}
        <div className="flex-1">
          <GraphEditorWithProvider
            graphId={editingGraphId}
            onSave={handleGraphSaved}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">GraphDash</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {profile?.username || user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Manage your graphs, view shared content, and collaborate with others.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('graphs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'graphs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Graphs ({userGraphs.length})
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shared'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shared With Me ({sharedGraphs.length})
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Contacts
            </button>
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Tab Content */}
        {!loading && (
          <>
            {/* My Graphs Tab */}
            {activeTab === 'graphs' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">My Graphs</h3>
                  <Button onClick={handleCreateGraph}>
                    Create New Graph
                  </Button>
                </div>
                
                {userGraphs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No graphs yet</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first graph visualization.</p>
                    <Button onClick={handleCreateGraph}>
                      Create Your First Graph
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userGraphs.map((graph) => (
                      <GraphCard
                        key={graph.id}
                        graph={graph}
                        type="owned"
                        onEdit={handleEditGraph}
                        onDelete={handleDeleteGraph}
                        onView={handleViewGraph}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Shared With Me Tab */}
            {activeTab === 'shared' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Shared With Me</h3>
                  <p className="text-gray-600">Graphs that others have shared with you.</p>
                </div>
                
                {sharedGraphs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No shared graphs</h3>
                    <p className="text-gray-600">When someone shares a graph with you, it will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedGraphs.map((graph) => (
                      <GraphCard
                        key={graph.id}
                        graph={graph}
                        type="shared"
                        onView={handleViewGraph}
                        onRemoveShared={handleRemoveSharedGraph}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Contacts</h3>
                  <p className="text-gray-600">Manage your contacts for graph sharing.</p>
                </div>
                
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Contacts Management</h3>
                  <p className="text-gray-600">Contact management will be implemented in a future update.</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
