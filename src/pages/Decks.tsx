import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

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
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.error('Limite de mazos alcanzado')
        alert('Limite de 6 mazos alcanzado.')
      }
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
        <h2 className="text-3xl font-bold mt-12 mb-2">Mis mazos</h2>
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
        <h4 className="text-xl font-semibold mb-4">Mazos: {decks.length}/6</h4>

        {loading ? (
          <p className="text-gray-400 animate-pulse">Cargando mazos...</p>
        ) : decks.length === 0 ? (
          <p className="text-gray-400">No tenés mazos todavía. ¡Creá uno!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {decks.map(deck => {
              const completed = localStorage.getItem(`deck-completed-${deck.id}`) === 'true'
              return (
                <div
                  key={deck.id}
                  className={`bg-gray-900 rounded-2xl p-6 transition cursor-pointer border
                    ${completed
                      ? 'border-green-500 shadow-lg shadow-green-500/10'
                      : 'border-gray-800 hover:border-violet-500'
                    }`}
                  onClick={() => navigate(`/decks/${deck.id}`)}
                  >
                  {completed && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full mb-3 inline-block">
                      Completado ✓
                    </span>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{deck.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {deck.cards.length} {deck.cards.length === 1 ? 'tarjeta' : 'tarjetas'}
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
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Decks