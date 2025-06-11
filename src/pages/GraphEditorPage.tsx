import { useState } from 'react'
import { GraphEditorWithProvider } from '../components/editor/GraphEditor'
import { useAuth } from '../hooks/useAuth'

export function GraphEditorPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [graphId] = useState<string | undefined>(undefined)

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access the graph editor.</p>
        </div>
      </div>
    )
  }

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
              <span className="text-sm text-gray-600">
                Welcome, {user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Graph Editor */}
      <div className="flex-1">
        <GraphEditorWithProvider
          graphId={graphId}
          onSave={(graphData) => {
            console.log('Graph saved:', graphData)
          }}
        />
      </div>
    </div>
  )
}

export default GraphEditorPage
