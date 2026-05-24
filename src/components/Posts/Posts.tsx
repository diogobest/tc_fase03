import { useEffect, useState } from 'react'
import type { Post } from '../../types'
import styled from "styled-components";

type PostsResponse = Post[] | { posts?: Post[] }

const POSTS_URL = '/api/posts?type=all'

const ContentComponent = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
`;

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(search.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    async function loadPosts() {
      try {
        setPosts([])

        const url = query
          ? `/api/posts/search?${new URLSearchParams({ q: query })}`
          : POSTS_URL

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as PostsResponse
        const nextPosts = Array.isArray(data) ? data : data.posts ?? []

        setSelectedPost(null)
        setPosts(nextPosts)
      } catch (err) {
        throw new Error('Ocorreu um erro na api.', { cause: err })
      }
    }

    loadPosts()
  }, [query])

  return (
    <main className="posts-page">
      <header className="posts-header">
        <h1>Posts</h1>
        <label className="search-field">
          <span>Filtrar Posts</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filtrar por título ou conteúdo"
          />
        </label>
      </header>

      {selectedPost ? (
        <article className="post-detail">
          <button className="back-button" type="button" onClick={() => setSelectedPost(null)}>
            Voltar
          </button>
          <h2>{selectedPost.title}</h2>
          <p className="post-meta">Autor: {selectedPost.author}</p>
          <p>{selectedPost.content}</p>
          <p className="post-meta">Criado em{new Date(selectedPost.created_at).toLocaleString()}</p>
          <p className="post-meta">Última atualização{new Date(selectedPost.updated_at).toLocaleString()}</p>
        </article>
      ) : (
        <section className="posts-grid" aria-label="Posts list">
          {posts.map((post) => (
            <button
              className="post-card"
              key={post.id ?? post.title}
              type="button"
              onClick={() => setSelectedPost(post)}
            >
              <h2>{post.title}</h2>
              <p>{post.author}</p>
              <ContentComponent>{post.content}</ContentComponent>
            </button>
          ))}
        </section>
      )}
    </main>
  )
}


export default Posts;
