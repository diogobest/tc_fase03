import { type ReactNode } from 'react'

export interface Post {
  id: string | number
  author: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface ProtectedRouteProps {
  isAuthenticated: boolean
  children: ReactNode
}
