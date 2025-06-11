import { Handle, Position, type NodeProps } from 'reactflow'
import { useState } from 'react'

// Default node component
export function DefaultNode({ data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Node')

  const handleLabelEdit = () => {
    setIsEditing(true)
  }

  const handleLabelSave = () => {
    data.label = label
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave()
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'Node')
      setIsEditing(false)
    }
  }

  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg bg-white border-2 transition-all ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-gray-300'
    } hover:shadow-xl`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="font-medium text-gray-800">
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-center min-w-0"
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={handleLabelEdit}
            className="cursor-pointer text-center"
            title="Double-click to edit"
          >
            {data.label || 'Node'}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

// Input node component (no input handle)
export function InputNode({ data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Input')

  const handleLabelEdit = () => {
    setIsEditing(true)
  }

  const handleLabelSave = () => {
    data.label = label
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave()
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'Input')
      setIsEditing(false)
    }
  }

  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg bg-green-50 border-2 transition-all ${
      selected ? 'border-green-500 shadow-green-200' : 'border-green-300'
    } hover:shadow-xl`}>
      <div className="font-medium text-green-800">
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-center min-w-0"
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={handleLabelEdit}
            className="cursor-pointer text-center"
            title="Double-click to edit"
          >
            {data.label || 'Input'}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

// Output node component (no output handle)
export function OutputNode({ data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Output')

  const handleLabelEdit = () => {
    setIsEditing(true)
  }

  const handleLabelSave = () => {
    data.label = label
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave()
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'Output')
      setIsEditing(false)
    }
  }

  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg bg-red-50 border-2 transition-all ${
      selected ? 'border-red-500 shadow-red-200' : 'border-red-300'
    } hover:shadow-xl`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="font-medium text-red-800">
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleLabelSave}
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-center min-w-0"
            autoFocus
          />
        ) : (
          <div
            onDoubleClick={handleLabelEdit}
            className="cursor-pointer text-center"
            title="Double-click to edit"
          >
            {data.label || 'Output'}
          </div>
        )}
      </div>
    </div>
  )
}

// Process node component (with icon)
export function ProcessNode({ data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useState(data.label || 'Process')

  const handleLabelEdit = () => {
    setIsEditing(true)
  }

  const handleLabelSave = () => {
    data.label = label
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave()
    } else if (e.key === 'Escape') {
      setLabel(data.label || 'Process')
      setIsEditing(false)
    }
  }

  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg bg-blue-50 border-2 transition-all ${
      selected ? 'border-blue-500 shadow-blue-200' : 'border-blue-300'
    } hover:shadow-xl`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <div className="font-medium text-blue-800">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleLabelSave}
              onKeyDown={handleKeyPress}
              className="bg-transparent border-none outline-none min-w-0"
              autoFocus
            />
          ) : (
            <div
              onDoubleClick={handleLabelEdit}
              className="cursor-pointer"
              title="Double-click to edit"
            >
              {data.label || 'Process'}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  )
}

// Export all node types
export const nodeTypes = {
  default: DefaultNode,
  input: InputNode,
  output: OutputNode,
  process: ProcessNode,
}

// Default export
export default nodeTypes
