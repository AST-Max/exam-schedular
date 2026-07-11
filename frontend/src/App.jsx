import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const path = window.location.pathname
  const role = localStorage.getItem('role')

  if (path === '/admin' && role === 'admin') return <AdminDashboard />
  if (path === '/student' && role === 'student') return <StudentDashboard />
  if (path === '/register') return <Register />
  return <Login />
}

export default App