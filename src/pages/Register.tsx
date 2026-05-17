import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (form.password !== (e.currentTarget.elements.namedItem('confirmPassword') as HTMLInputElement).value) {
        setError('Las contraseñas no coinciden')
        return
      } else {
        setError(null)
        await api.post('/auth/register', form)
        navigate('/login')
      }
    } catch (error) {
      console.error('Error registering user:', error)
      setError('Error al registrar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#0F172A] min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl text-[#F8FAFC] font-bold text-center mb-2">Crear Cuenta</h1>
        <p className="text-[#94A3B8] text-center mb-8">Empezá a estudiar con FlashCards</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Contraseña"
            className="px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button type="submit" disabled={loading} className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2 px-4 rounded disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
            <p className="text-[#94A3B8] text-center">¿Ya tienes una cuenta? <a href="/login" className="text-[#7C3AED] hover:text-[#6D28D9]">Iniciar Sesión</a></p>
        </form>
      </div>
    </div>
  )
}

export default Register