import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'

interface Flashcard {
  id: number
  question: string
  answer: string
}

interface Deck {
  id: number
  title: string
  cards: Flashcard[]
}

function DeckDetail() {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDeck()
  }, [])

  async function fetchDeck() {
    try {
      const { data } = await api.get(`/decks/${id}`)
      setDeck(data)
    } catch {
      navigate('/decks')
    } finally {
      setLoading(false)
    }
  }

  async function deleteCard(cardId: number) {
    try {
      await api.delete(`/flashcards/${cardId}`)
      setDeck(prev => prev ? {
        ...prev,
        cards: prev.cards.filter(c => c.id !== cardId)
      } : null)
    } catch {
      console.error('Error al eliminar flashcard')
    }
  }

  async function generateCards() {
    if (!text.trim()) return
    setGenerating(true)
    try {
      await api.post(`/flashcards/generate/${id}`, { text })
      setText('')
      await fetchDeck()
    } catch {
      console.error('Error al generar flashcards')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Cargando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate('/decks')}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Volver
        </button>
        <h1 className="text-xl font-bold">{deck?.title}</h1>
        <button
          onClick={() => navigate(`/decks/${id}/study`)}
          disabled={!deck?.cards.length}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Estudiar
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-12">

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Generar flashcards con IA</h2>
          <textarea
            rows={5}
            placeholder="Pegá cualquier texto y la IA va a generar flashcards automáticamente..."
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition resize-none mb-3"
          />
          <button
            onClick={generateCards}
            disabled={generating || !text.trim()}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 transition px-6 py-3 rounded-xl font-semibold"
          >
            {generating ? 'Generando...' : 'Generar flashcards ✨'}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4">
          Flashcards ({deck?.cards.length})
        </h2>

        {deck?.cards.length === 0 ? (
          <p className="text-gray-400">No hay flashcards todavía. Generá algunas con IA.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deck?.cards.map(card => (
              <div
                key={card.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 relative group"
              >
                <p className="text-sm text-violet-400 mb-2">Pregunta</p>
                <p className="font-semibold mb-3">{card.question}</p>
                <p className="text-sm text-gray-400 mb-2">Respuesta</p>
                <p className="text-gray-300">{card.answer}</p>
                <button
                  onClick={() => deleteCard(card.id)}
                  className="absolute top-1 right-3 text-red-400 hover:text-red-300 hover:cursor-pointer transition opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default DeckDetail