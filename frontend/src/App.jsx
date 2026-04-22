import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PublicCard from './pages/PublicCard'
import EditorPublicCard from './pages/EditorPublicCard'
import ProfileEditor from './editor/ProfileEditor'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/editor"    element={<PrivateRoute><ProfileEditor /></PrivateRoute>} />
        <Route path="/builder"   element={<Navigate to="/editor" replace />} />
        <Route path="/card/:slug" element={<EditorPublicCard />} />
        <Route path="/"          element={<Home />} />
        <Route path="/:slug"     element={<PublicCard />} />
      </Routes>
    </BrowserRouter>
  )
}
