import { type ReactNode, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './components/Main/Main'
import Posts from './components/Posts/Posts'
import AdminPosts from './pages/AdminPosts'
import Login from './pages/Login'
import PostForm from './pages/PostForm'

const LOCAL_STORAGE_KEY = 'teacher-authenticated'

const AppContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 100svh;
`

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
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem(LOCAL_STORAGE_KEY)))

  function login(accessToken: string) {
    localStorage.setItem(LOCAL_STORAGE_KEY, accessToken)
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  return(
    <BrowserRouter>
      <AppContent>
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
      </AppContent>
    </BrowserRouter>
  )
}

export default App;
