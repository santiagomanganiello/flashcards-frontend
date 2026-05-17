import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import github from '../assets/github-icon.webp'

function Sidebar() {
  const [open, setOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/home', label: 'Inicio', icon: '🏠' },
    { path: '/decks', label: 'Mis mazos', icon: '📚' },
    { path: '/profile', label: 'Mi Perfil', icon: '👤' },
  ]

  function handleNavigate(path: string) {
    navigate(path)
    setOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full px-4 py-6">
      <h1 className="text-xl font-bold text-white px-3 mb-8">
        Froxy<span className="text-violet-500">Cards</span>
      </h1>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map(link => (
          <button
            key={link.path}
            onClick={() => handleNavigate(link.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left
              ${location.pathname === link.path
                ? 'bg-violet-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
          >
            <span>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>
      
      <button 
        onClick={() => window.open('https://github.com/santiagomanganiello', '_blank')}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition text-left"
      >
        <img src={github} alt="GitHub" className="w-6 h-6" />
        GitHub
      </button>

      <button
        onClick={() => { logout(); navigate('/login') }}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition text-left"
      >
        <span>🚪</span>
        Cerrar sesión
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile: botón hamburguesa */}
      <button
        className="md:hidden fixed top-2 left-2 z-5 p-2 text-3xl rounded-lg text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Mobile: overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: sidebar deslizable */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 z-50 transition-transform duration-300
        md:static md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </aside>
    </>
  )
}

export default Sidebar