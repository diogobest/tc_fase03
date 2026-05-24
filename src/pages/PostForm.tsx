import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Actions,
  Eyebrow,
  FormField,
  PagePanel,
  PostFormContainer,
  PrimaryButton,
  SecondaryButton,
  Status,
} from '../components/ui'
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
    <PagePanel>
      <Eyebrow>{mode === 'edit' ? 'Edição' : 'Criação'}</Eyebrow>
      <h1>{mode === 'edit' ? 'Editar postagem' : 'Criar postagem'}</h1>
      <p>{mode === 'edit' ? 'Altere os dados atuais da postagem.' : 'Preencha os dados para publicar uma nova postagem.'}</p>

      {isLoading ? (
        <Status>Carregando postagem...</Status>
      ) : (
        <PostFormContainer onSubmit={handleSubmit}>
          <FormField>
            <span>Título</span>
            <input
              type="text"
              value={payload.title}
              onChange={(event) => setPayload({ ...payload, title: event.target.value })}
              placeholder="Título da postagem"
            />
          </FormField>

          <FormField>
            <span>Conteúdo</span>
            <textarea
              value={payload.content}
              onChange={(event) => setPayload({ ...payload, content: event.target.value })}
              placeholder="Conteúdo da postagem"
              rows={8}
            />
          </FormField>

          <FormField>
            <span>Autor</span>
            <input
              type="text"
              value={payload.author}
              onChange={(event) => setPayload({ ...payload, author: event.target.value })}
              placeholder="Nome do(a) docente"
            />
          </FormField>

          {error && <Status $error>{error}</Status>}

          <Actions>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar postagem'}
            </PrimaryButton>
            <SecondaryButton type="button" onClick={() => navigate('/admin')}>
              Cancelar
            </SecondaryButton>
          </Actions>
        </PostFormContainer>
      )}
    </PagePanel>
  )
}

export default PostForm
