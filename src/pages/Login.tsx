import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type LoginProps = {
  onLogin: () => void
}

function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user.trim() || !password.trim()) {
      setError('Informe e-mail e senha para acessar a área docente.')
      return
    }

    onLogin()
    navigate('/admin')
  }

  return (
    <section className="page-panel auth-panel">
      <p className="eyebrow">Autenticação</p>
      <h1>Login docente</h1>
      <p>Acesse para criar, editar e administrar postagens.</p>

      <form className="post-form" onSubmit={handleSubmit}>
        <label>
          <span>E-mail</span>
          <input
            type="text"
            value={user}
            onChange={(event) => setUser(event.target.value)}
            placeholder="usuário"
          />
        </label>

        <label>
          <span>Senha</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Digite sua senha"
          />
        </label>

        {error && <p className="status status-error">{error}</p>}

        <button className="primary-button" type="submit">Entrar</button>
      </form>
    </section>
  )
}

export default Login
