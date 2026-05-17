import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

interface Stats {
  decks: number
  cards: number
}

function Home() {
  const [stats, setStats] = useState<Stats>({ decks: 0, cards: 0 })
  const { userId } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const { data } = await api.get('/decks')
      const totalCards = data.reduce((acc: number, deck: { cards: { id: number }[] }) => acc + deck.cards.length, 0)
      setStats({ decks: data.length, cards: totalCards })
    } catch {
      console.error('Error al obtener stats')
    }
  }

  const steps = [
    {
      icon: '📝',
      title: 'Creá un mazo',
      description: 'Un mazo es un conjunto de flashcards sobre un tema. Por ejemplo: "Historia", "Inglés" o "Programación".'
    },
    {
      icon: '✨',
      title: 'Generá flashcards con IA',
      description: 'Pegá cualquier texto — apuntes, un artículo, un resumen — y la IA genera automáticamente preguntas y respuestas.'
    },
    {
      icon: '🧠',
      title: 'Estudiá con multiple choice',
      description: 'Entrá al modo estudio y respondé preguntas con 4 opciones. La IA genera las respuestas incorrectas para que el desafío sea real.'
    },
    {
      icon: '📈',
      title: 'Seguí tu progreso',
      description: 'Al finalizar cada sesión ves cuántas respuestas acertaste. Repetí los mazos hasta dominarlos.'
    },
  ]

  return (
    <div className="px-8 py-12 max-w-4xl mx-auto">

      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
            Froxy<span className="text-violet-500">Cards</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Estudiá más inteligente con tarjetas generadas por inteligencia artificial.
        </p>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6">¿Cómo funciona?</h2>
        <div className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-5 bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-500 transition transform hover:-translate-y-1"
            >
              <div className="text-3xl">{step.icon}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Mazos creados</p>
          <p className="text-4xl font-bold text-violet-400">{stats.decks}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Flashcards totales</p>
          <p className="text-4xl font-bold text-violet-400">{stats.cards}</p>
        </div>
      </div>
    </div>
  )
}

export default Home