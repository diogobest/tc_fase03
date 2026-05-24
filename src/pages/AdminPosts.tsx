import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Actions,
  DangerButton,
  Eyebrow,
  PagePanel,
  PrimaryLink,
  SecondaryLink,
  Status,
} from '../components/ui'
import type { Post } from '../types'

const PageTitleRow = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 28px;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`

const AdminList = styled.div`
  display: grid;
  gap: 14px;
`

const AdminRow = styled.article`
  align-items: center;
  display: flex;
  gap: 18px;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg);
  box-shadow: var(--shadow);

  h2 {
    margin-bottom: 6px;
  }

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`

function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/posts?type=all')

        if (!response.ok) {
          throw new Error(`Erro ao carregar postagens: ${response.status}`)
        }

        const data = (await response.json()) as Post[]
        setPosts(data)
        setError('')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as postagens.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadPosts()
  }, [])

  async function deletePost(post: Post) {
    const shouldDelete = window.confirm(`Excluir a postagem "${post.title}"?`)

    if (!shouldDelete) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error(`Erro ao excluir postagem: ${response.status}`)
      }

      setPosts((currentPosts) => currentPosts.filter((currentPost) => currentPost.id !== post.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a postagem.')
    }
  }

  return (
    <PagePanel>
      <PageTitleRow>
        <div>
          <Eyebrow>Administração</Eyebrow>
          <h1>Gerenciar postagens</h1>
        </div>
        <PrimaryLink to="/posts/new">Criar postagem</PrimaryLink>
      </PageTitleRow>

      {isLoading && <Status>Carregando postagens...</Status>}
      {error && <Status $error>{error}</Status>}

      {!isLoading && !error && posts.length === 0 && <Status>Nenhuma postagem cadastrada.</Status>}

      {!isLoading && posts.length > 0 && (
        <AdminList>
          {posts.map((post) => (
            <AdminRow key={post.id}>
              <div>
                <h2>{post.title}</h2>
                <p>{post.author}</p>
              </div>
              <Actions>
                <SecondaryLink to={`/posts/${post.id}/edit`}>Editar</SecondaryLink>
                <DangerButton type="button" onClick={() => void deletePost(post)}>
                  Excluir
                </DangerButton>
              </Actions>
            </AdminRow>
          ))}
        </AdminList>
      )}
    </PagePanel>
  )
}

export default AdminPosts
