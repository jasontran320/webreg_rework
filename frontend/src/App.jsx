import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Planner from './pages/Plan.jsx'
import Header from './components/Header.jsx'
import { CourseProvider } from './data/CourseContext.jsx'
import ScrollToTop from './components/ScrollTop.jsx'

function App() {
  return (
    <CourseProvider>
      <Router>
        <div className="main-app">
          <Header />
          <main className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/plan" element={<Planner />} />
            </Routes>
            <ScrollToTop />
          </main>
        </div>
      </Router>
    </CourseProvider>
  )
}

export default App
