import { useState } from 'react'
import { Button } from './Button'
import type { ContactWithProfile } from '../../types/database'

interface ContactCardProps {
  contact: ContactWithProfile
  onRemove?: (contactId: string) => void
  onShare?: (contactId: string) => void
}

export function ContactCard({ contact, onRemove, onShare }: ContactCardProps) {
  const [loading, setLoading] = useState(false)

  const handleRemove = async () => {
    if (!onRemove) return
    if (!confirm(`Remove ${contact.profile.username} from your contacts?`)) {
      return
    }
    
    setLoading(true)
    try {
      onRemove(contact.contact_id)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!onShare) return
    setLoading(true)
    try {
      onShare(contact.contact_id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Contact Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {contact.profile.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {contact.profile.username}
            </h3>
            <p className="text-sm text-gray-500">
              Added: {new Date(contact.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleShare}
            disabled={loading}
            className="flex-1"
          >
            Share Graph
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={loading}
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ContactCard
