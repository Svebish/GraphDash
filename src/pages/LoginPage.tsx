import { useEffect } from 'react'
import { UserAuthForm } from '../components/auth/UserAuthForm'
import { useAuth } from '../hooks/useAuth'

interface LoginPageProps {
  onAuthenticated?: () => void
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (isAuthenticated && onAuthenticated) {
      onAuthenticated()
    }
  }, [isAuthenticated, onAuthenticated])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You're already signed in!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GraphDash</h1>
          <p className="mt-2 text-gray-600">Your collaborative graph visualization platform</p>
        </div>
        
        <UserAuthForm onSuccess={onAuthenticated} />
      </div>
    </div>
  )
}
