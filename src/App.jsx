import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import MatchDetail from './pages/MatchDetail'
import CreateMatch from './pages/CreateMatch.jsx'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/match/:id" element={<MatchDetail />} />
        <Route path="/create-match" element={<CreateMatch />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App