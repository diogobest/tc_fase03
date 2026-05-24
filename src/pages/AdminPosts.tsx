import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../types'

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
    <section className="page-panel admin-page">
      <div className="page-title-row">
        <div>
          <p className="eyebrow">Administração</p>
          <h1>Gerenciar postagens</h1>
        </div>
        <Link className="primary-link" to="/posts/new">Criar postagem</Link>
      </div>

      {isLoading && <p className="status">Carregando postagens...</p>}
      {error && <p className="status status-error">{error}</p>}

      {!isLoading && !error && posts.length === 0 && <p className="status">Nenhuma postagem cadastrada.</p>}

      {!isLoading && posts.length > 0 && (
        <div className="admin-list">
          {posts.map((post) => (
            <article className="admin-row" key={post.id}>
              <div>
                <h2>{post.title}</h2>
                <p>{post.author}</p>
              </div>
              <div className="admin-actions">
                <Link className="secondary-link" to={`/posts/${post.id}/edit`}>Editar</Link>
                <button className="danger-button" type="button" onClick={() => void deletePost(post)}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminPosts
