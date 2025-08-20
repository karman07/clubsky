import { useState } from 'react'

const useAuth = () => ({
  login: async (email: string, password: string) => {
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (email === 'admin@gmail.com' && password === 'password123') {
      return { user: { email } }
    }
    throw new Error('Invalid credentials')
  },
  user: null
})

export default function Login() {
  const { login} = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      alert('Login successful!')
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome back</h1>
            <p className="text-blue-600">Sign in to your account</p>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-blue-800 font-medium text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-blue-50/50 text-blue-900 placeholder-blue-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-blue-800 font-medium text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-3 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-blue-50/50 text-blue-900 placeholder-blue-400"
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button 
              onClick={onSubmit} 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
    
        </div>
      </div>
    </div>
  )
}