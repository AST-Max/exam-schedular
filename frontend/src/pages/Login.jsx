import { useState } from 'react'
import API from '../api/axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      if (res.data.role === 'admin') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/student'
      }
    } catch (err) {
      setError('Invalid credentials')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950 flex items-center justify-center p-4">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <div className="relative bg-gray-800 bg-opacity-60 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-emerald-500 p-3 rounded-xl mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Exam Scheduler</h1>
            <p className="text-xs text-gray-400">Smart Timetable Generator</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-gray-400 mb-6 text-sm">Sign in to your account</p>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-red-400 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-gray-400 text-sm mb-1 block">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-emerald-500 focus:outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-gray-400 text-sm mb-1 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-emerald-500 focus:outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full p-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-emerald-400 hover:text-emerald-300">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login