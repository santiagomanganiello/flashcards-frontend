import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import sapo from '../assets/sapo-lector-1.png'
import correct from '../assets/froxy-correct.png'
import incorrect from '../assets/froxy-incorrect.png'

interface Flashcard {
  id: number
  question: string
  answer: string
  wrongAnswers: string[]
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function Study() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    if (cards.length > 0) generateOptions(currentIndex)
  }, [cards, currentIndex])

  async function fetchCards() {
    try {
      const { data } = await api.get(`/flashcards/${id}`)
      setCards(data)
    } catch {
      navigate('/decks')
    } finally {
      setLoading(false)
    }
  }

  function generateOptions(index: number) {
    const card = cards[index]
    const opts = shuffle([card.answer, ...card.wrongAnswers])
    setOptions(opts)
    setSelected(null)
  }

  function handleSelect(option: string) {
    if (selected) return
    setSelected(option)
    if (option === cards[currentIndex].answer) {
      setScore(s => s + 1)
    }
  }

  function next() {
    if (currentIndex + 1 >= cards.length) {
      setFinished(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  function restart() {
    setCurrentIndex(0)
    setSelected(null)
    setFinished(false)
    setScore(0)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400 animate-pulse">Cargando...</p>
    </div>
  )

  if (finished) return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6">
      <p className="text-5xl">🎉</p>
      <h2 className="text-3xl font-bold">Completaste el mazo</h2>
      <p className="text-gray-400 text-xl">
        {score} / {cards.length} correctas
      </p>
      <div className="flex gap-4">
        <button
          onClick={restart}
          className="bg-violet-600 hover:bg-violet-500 transition px-6 py-3 rounded-xl font-semibold"
        >
          Repetir
        </button>
        <button
          onClick={() => navigate(`/decks/${id}`)}
          className="border border-gray-700 hover:border-gray-500 transition px-6 py-3 rounded-xl"
        >
          Volver al mazo
        </button>
      </div>
    </div>
  )

  const card = cards[currentIndex]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-800">
        <button
          onClick={() => navigate(`/decks/${id}`)}
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Volver
        </button>
        <span className="text-gray-400 text-sm">
          {currentIndex + 1} / {cards.length}
        </span>
        <span className="text-violet-400 text-sm font-semibold">
          {score} correctas
        </span>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8 max-w-2xl mx-auto w-full">
        <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
          <p className="text-sm text-violet-400 mb-4">Pregunta</p>
          { selected && (
            <img
              src={selected === card.answer ? correct : incorrect}
              alt={selected === card.answer ? "Correcto" : "Incorrecto"}
              className="w-48 h-auto mx-auto mb-4"
              />
            ) }
            { !selected && (
              <img
              src={sapo}  
              alt="Sapo Lector"
              className="w-48 h-auto mx-auto mb-4"
              />
            ) }
          <p className="text-2xl font-semibold">{card.question}</p>
        </div>

        <div className="w-full grid grid-cols-1 gap-3">
          {options.map(option => {
            let style = 'border border-gray-700 hover:border-violet-500'
            if (selected) {
              if (option === card.answer) {
                style = 'border-2 border-green-500 bg-green-500/10'
              } else if (option === selected) {
                style = 'border-2 border-red-500 bg-red-500/10'
              } else {
                style = 'border border-gray-800 opacity-50'
              }
            }
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-6 py-4 rounded-xl transition ${style}`}
              >
                {option}
              </button>
            )
          })}
        </div>

        {selected && (
          <button
            onClick={next}
            className="bg-violet-600 hover:bg-violet-500 transition px-8 py-3 rounded-xl font-semibold"
          >
            {currentIndex + 1 >= cards.length ? 'Finalizar' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Study