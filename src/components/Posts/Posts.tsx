import { useEffect, useState } from 'react'
import type { Post } from '../../types'
import styled from 'styled-components'
import { SecondaryButton } from '../ui'

type PostsResponse = Post[] | { posts?: Post[] }

const POSTS_URL = '/api/posts?type=all'

const PostsPage = styled.main`
  flex: 1;
  padding: 56px 32px;
  text-align: left;

  @media (max-width: 640px) {
    padding: 32px 16px;
  }
`

const PostsHeader = styled.header`
  max-width: 760px;
  margin: 0 auto 40px;
  text-align: center;
`

const SearchField = styled.label`
  display: grid;
  gap: 8px;
  max-width: 520px;
  margin: 24px auto 0;
  color: var(--text-h);
  font-size: 15px;
  font-weight: 600;
  text-align: left;

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text-h);
    background: var(--bg);
    font: inherit;
  }

  input:focus {
    border-color: var(--accent-border);
    outline: 3px solid var(--accent-bg);
  }
`

const PostsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-top: 32px;
`

const PostCard = styled.button`
  min-height: 180px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 18px;
  color: inherit;
  background: var(--bg);
  box-shadow: var(--shadow);
  cursor: pointer;
  font: inherit;
  text-align: left;
  transition: border-color 160ms ease, transform 160ms ease;

  &:hover,
  &:focus-visible {
    border-color: var(--accent-border);
    outline: none;
    transform: translateY(-2px);
  }

  p {
    margin-top: 12px;
  }
`

const PostDetail = styled.article`
  max-width: 760px;
  margin: 0 auto;
  padding: 32px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg);
  box-shadow: var(--shadow);

  h2 {
    margin-top: 20px;
  }

  p {
    margin-top: 14px;
  }
`

const PostMeta = styled.p`
  color: var(--text);
  font-size: 15px;
`

const ContentComponent = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
`

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
    <PostsPage>
      <PostsHeader>
        <h1>Posts</h1>
        <SearchField>
          <span>Filtrar Posts</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filtrar por título ou conteúdo"
          />
        </SearchField>
      </PostsHeader>

      {selectedPost ? (
        <PostDetail>
          <SecondaryButton type="button" onClick={() => setSelectedPost(null)}>
            Voltar
          </SecondaryButton>
          <h2>{selectedPost.title}</h2>
          <PostMeta>Autor: {selectedPost.author}</PostMeta>
          <p>{selectedPost.content}</p>
          <PostMeta>Criado em {new Date(selectedPost.created_at).toLocaleString()}</PostMeta>
          <PostMeta>Última atualização {new Date(selectedPost.updated_at).toLocaleString()}</PostMeta>
        </PostDetail>
      ) : (
        <PostsGrid aria-label="Posts list">
          {posts.map((post) => (
            <PostCard
              key={post.id ?? post.title}
              type="button"
              onClick={() => setSelectedPost(post)}
            >
              <h2>{post.title}</h2>
              <p>{post.author}</p>
              <ContentComponent>{post.content}</ContentComponent>
            </PostCard>
          ))}
        </PostsGrid>
      )}
    </PostsPage>
  )
}


export default Posts;
