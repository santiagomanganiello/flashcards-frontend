import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Decks from './pages/Decks'
import DeckDetail from './pages/DeckDetail'
import Study from './pages/Study'
import Layout from './components/Layout'
import Home from './pages/Home'

function App () {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/decks" element={<Layout><Decks /></Layout>} />
          <Route path="/decks/:id" element={<DeckDetail />} />
          <Route path="/decks/:id/study" element={<Study />} />
          <Route path="/home" element={<Layout><Home /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App