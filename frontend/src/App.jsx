import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Planner from './pages/Plan.jsx'
import Header from './components/Header.jsx'

function App() {
  
  return (
    <Router>
      <div className="main-app">
        <Header />
        <main className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/plan" element={<Planner />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
