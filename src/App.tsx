import { type ReactNode, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import Posts from './components/Posts/Posts'
import AdminPosts from './pages/AdminPosts'
import Login from './pages/Login'
import PostForm from './pages/PostForm'
import './App.css'

const AUTH_KEY = 'teacher-authenticated'

type ProtectedRouteProps = {
  isAuthenticated: boolean
  children: ReactNode
}

function ProtectedRoute({ isAuthenticated, children }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_KEY) === 'true')

  function login() {
    localStorage.setItem(AUTH_KEY, 'true')
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return(
    <BrowserRouter>
      <div className="app-content">
        <Header isAuthenticated={isAuthenticated} onLogout={logout}/>
        <Main>
          <Routes>
            <Route path="/" element={<Posts/>}/>
            <Route path="/login" element={<Login onLogin={login}/>}/>
            <Route path="/posts/new" element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PostForm mode="create"/>
              </ProtectedRoute>
            )}/>
            <Route path="/posts/:id/edit" element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PostForm mode="edit"/>
              </ProtectedRoute>
            )}/>
            <Route path="/admin" element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminPosts/>
              </ProtectedRoute>
            )}/>
          </Routes>
        </Main>
        <Footer/>
      </div>
    </BrowserRouter>
  )
}

export default App;
