import { Button } from '../ui/Button'
import { useReactFlow } from 'reactflow'

interface ToolbarProps {
  onAddNode: () => void
  onDeleteSelected: () => void
  onClearGraph: () => void
  onSave: () => void
  onGenerateSample: () => void
  saving?: boolean
  readOnly?: boolean
  hasUnsavedChanges?: boolean
  nodeType?: string
  onNodeTypeChange?: (nodeType: string) => void
  graphTitle?: string
  onGraphTitleChange?: (title: string) => void
}

export function Toolbar({
  onAddNode,
  onDeleteSelected,
  onClearGraph,
  onSave,
  onGenerateSample,
  saving = false,
  readOnly = false,
  hasUnsavedChanges = false,
  nodeType = 'default',
  onNodeTypeChange,
  graphTitle = 'Untitled Graph',
  onGraphTitleChange
}: ToolbarProps) {
  const { fitView, zoomIn, zoomOut, zoomTo } = useReactFlow()

  const handleFitView = () => {
    fitView({ padding: 0.1, duration: 800 })
  }

  const handleZoomIn = () => {
    zoomIn({ duration: 200 })
  }

  const handleZoomOut = () => {
    zoomOut({ duration: 200 })
  }

  const handleResetZoom = () => {
    zoomTo(1, { duration: 200 })
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Left side - Graph title and actions */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={graphTitle}
            onChange={(e) => onGraphTitleChange?.(e.target.value)}
            disabled={readOnly}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
            placeholder="Graph title..."
          />
          
          {!readOnly && (
            <>
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <select
                  value={nodeType}
                  onChange={(e) => onNodeTypeChange?.(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Default Node</option>
                  <option value="input">Input Node</option>
                  <option value="output">Output Node</option>
                  <option value="process">Process Node</option>
                </select>
                <Button size="sm" onClick={onAddNode}>
                  Add Node
                </Button>
              </div>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={onGenerateSample}>
                  Sample Data
                </Button>
                <Button size="sm" variant="outline" onClick={onDeleteSelected}>
                  Delete Selected
                </Button>
                <Button size="sm" variant="outline" onClick={onClearGraph}>
                  Clear All
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Center - View controls */}
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={handleZoomOut}>
            Zoom Out
          </Button>
          <Button size="sm" variant="outline" onClick={handleResetZoom}>
            Reset Zoom
          </Button>
          <Button size="sm" variant="outline" onClick={handleZoomIn}>
            Zoom In
          </Button>
          <Button size="sm" variant="outline" onClick={handleFitView}>
            Fit View
          </Button>
        </div>

        {/* Right side - Status and save */}
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-yellow-600 flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              Unsaved changes
            </span>
          )}
          
          {saving && (
            <span className="text-sm text-blue-600 flex items-center">
              <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full mr-2"></div>
              Saving...
            </span>
          )}
          
          <Button 
            size="sm" 
            onClick={onSave} 
            disabled={saving || readOnly}
            variant={hasUnsavedChanges ? "primary" : "outline"}
          >
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Additional toolbar for graph properties
export function GraphPropertiesPanel() {
  return (
    <div className="bg-gray-50 border-r border-gray-200 w-64 p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Graph Properties</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Layout
          </label>
          <select className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="free">Free Form</option>
            <option value="hierarchical">Hierarchical</option>
            <option value="circular">Circular</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Style
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input type="color" defaultValue="#ffffff" className="w-8 h-6 rounded border" />
              <span className="text-sm text-gray-600">Background</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="color" defaultValue="#000000" className="w-8 h-6 rounded border" />
              <span className="text-sm text-gray-600">Border</span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edge Style
          </label>
          <div className="space-y-2">
            <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
              <option value="default">Default</option>
              <option value="straight">Straight</option>
              <option value="smoothstep">Smooth Step</option>
              <option value="bezier">Bezier</option>
            </select>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="animated" />
              <label htmlFor="animated" className="text-sm text-gray-600">Animated</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
