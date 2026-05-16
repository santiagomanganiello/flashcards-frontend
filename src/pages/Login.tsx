import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import sapo from '../assets/froxy-bienvenida.png'


function Login() {

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.userId)
      navigate('/decks')
    } catch  {
      console.error('Error logging in user:', error)
      setError('Credenciales inválidas')
    } finally {
      setLoading(false)
    }  
  }


  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl text-[#F8FAFC] font-bold text-center mb-2">Bienvenido</h1>
        <p className="text-[#94A3B8] text-center mb-8">Ingresá a tu cuenta</p>
        <img src={sapo} alt="Sapo Lector" className="mx-auto mb-6 w-60" /> 
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button type="submit" disabled={loading} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2 px-4 rounded disabled:opacity-50">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          <p className="text-[#94A3B8] text-center">¿No tienes una cuenta? <a href="/register" className="text-[#7C3AED] hover:text-[#6D28D9]">Registrate acá</a></p>
        </form>
      </div>
    </div>
  )
}

export default Login