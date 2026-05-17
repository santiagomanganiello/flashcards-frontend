import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import iconfrog from '../assets/frog-icon.webp'

interface Deck {
  id: number
  title: string
  cards: { id: number }[]
}

function Decks() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [newDeckTitle, setNewDeckTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDecks()
  }, [])

  async function fetchDecks() {
    try {
      const { data } = await api.get('/decks')
      setDecks(data)
    } catch {
      logout()
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  async function createDeck() {
    if (!newDeckTitle.trim()) return

    try {
      const { data } = await api.post('/decks', { title: newDeckTitle })
      setDecks([...decks, { ...data, cards: [] }])
      setNewDeckTitle('')
    } catch {
      console.error('Error al crear mazo')
    }
  }

  async function deleteDeck(id: number) {
    try {
      await api.delete(`/decks/${id}`)
      setDecks(decks.filter(d => d.id !== id))
    } catch {
      console.error('Error al eliminar mazo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <main className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Mis mazos</h2>
        <p className="text-gray-400 mb-4">Crea y usá tus mazos para dividir tus estudios por temas</p>
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Nombre del nuevo mazo..."
            value={newDeckTitle}
            onChange={e => setNewDeckTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createDeck()}
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            onClick={createDeck}
            className="bg-violet-600 hover:bg-violet-500 transition px-6 py-3 rounded-xl font-semibold"
          >
            Crear
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400 animate-pulse">Cargando mazos...</p>
        ) : decks.length === 0 ? (
          <p className="text-gray-400">No tenés mazos todavía. ¡Creá uno!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {decks.map(deck => (
              <div
                key={deck.id}
                className="bg-gray-900 border border-gray-800 hover:border-violet-500 rounded-2xl p-6 transition cursor-pointer"
                onClick={() => navigate(`/decks/${deck.id}`)}
              >
                <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {deck.cards.length} {deck.cards.length === 1 ? 'tarjeta' : 'Flashcards'}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/decks/${deck.id}/study`) }}
                    className="text-sm bg-violet-600 hover:bg-violet-500 transition px-4 py-2 rounded-lg"
                  >
                    Estudiar
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deleteDeck(deck.id) }}
                    className="text-sm text-red-400 hover:text-red-300 transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Decks