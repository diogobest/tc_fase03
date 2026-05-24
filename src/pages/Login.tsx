import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eyebrow, FormField, PagePanel, PostFormContainer, PrimaryButton, Status } from '../components/ui'
import type { LoginResponse } from '../types'

type LoginProps = {
  onLogin: (accessToken: string) => void
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!user.trim() || !password.trim()) {
      setError('Informe usuário e senha para acessar a área docente.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Usuário ou senha inválidos.' : 'Não foi possível realizar o login.')
      }

      const data = (await response.json()) as LoginResponse
      onLogin(data.accessToken)
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível realizar o login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PagePanel $narrow>
      <Eyebrow>Autenticação</Eyebrow>
      <h1>Login docente</h1>
      <p>Acesse para criar, editar e administrar postagens.</p>

      <PostFormContainer onSubmit={handleSubmit}>
        <FormField>
          <span>Usuário</span>
          <input
            type="text"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            placeholder="usuário"
          />
        </FormField>

        <FormField>
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
          />
        </FormField>

        {error && <Status $error>{error}</Status>}

        <PrimaryButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </PrimaryButton>
      </PostFormContainer>
    </PagePanel>
  )
}

export default Login
