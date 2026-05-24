import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Post } from '../types'

type PostFormProps = {
  mode: 'create' | 'edit'
}

type PostPayload = {
  title: string
  content: string
  author: string
}

const emptyPayload: PostPayload = {
  title: '',
  content: '',
  author: '',
}

function PostForm({ mode }: PostFormProps) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [payload, setPayload] = useState<PostPayload>(emptyPayload)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(mode === 'edit')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (mode !== 'edit' || !id) {
      return
    }

    async function loadPost() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/posts/${id}`)

        if (!response.ok) {
          throw new Error(`Erro ao carregar postagem: ${response.status}`)
        }

        const post = (await response.json()) as Post
        setPayload({
          title: post.title,
          content: post.content,
          author: post.author,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a postagem.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadPost()
  }, [id, mode])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!payload.title.trim() || !payload.content.trim() || !payload.author.trim()) {
      setError('Título, conteúdo e autor são obrigatórios.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await fetch(mode === 'edit' ? `/api/posts/${id}` : '/api/posts', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Erro ao salvar postagem: ${response.status}`)
      }

      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a postagem.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-panel">
      <p className="eyebrow">{mode === 'edit' ? 'Edição' : 'Criação'}</p>
      <h1>{mode === 'edit' ? 'Editar postagem' : 'Criar postagem'}</h1>
      <p>{mode === 'edit' ? 'Altere os dados atuais da postagem.' : 'Preencha os dados para publicar uma nova postagem.'}</p>

      {isLoading ? (
        <p className="status">Carregando postagem...</p>
      ) : (
        <form className="post-form" onSubmit={handleSubmit}>
          <label>
            <span>Título</span>
            <input
              type="text"
              value={payload.title}
              onChange={(event) => setPayload({ ...payload, title: event.target.value })}
              placeholder="Título da postagem"
            />
          </label>

          <label>
            <span>Conteúdo</span>
            <textarea
              value={payload.content}
              onChange={(event) => setPayload({ ...payload, content: event.target.value })}
              placeholder="Conteúdo da postagem"
              rows={8}
            />
          </label>

          <label>
            <span>Autor</span>
            <input
              type="text"
              value={payload.author}
              onChange={(event) => setPayload({ ...payload, author: event.target.value })}
              placeholder="Nome do(a) docente"
            />
          </label>

          {error && <p className="status status-error">{error}</p>}

          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar postagem'}
            </button>
            <button className="secondary-button" type="button" onClick={() => navigate('/admin')}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default PostForm
