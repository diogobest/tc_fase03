import { useEffect, useState } from 'react'
import type { Post } from '../../types'

type PostsResponse = Post[] | { posts?: Post[] }

const POSTS_URL = '/api/posts'

function uniquePosts(posts: Post[]) {
  const seen = new Set<Post['id']>()

  return posts.filter((post) => {
    if (seen.has(post.id)) {
      return false
    }

    seen.add(post.id)
    return true
  })
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setQuery(search.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      try {
        setIsLoading(true)

        const url = query
          ? `/api/posts/search?${new URLSearchParams({ q: query })}`
          : POSTS_URL

        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as PostsResponse
        const nextPosts = Array.isArray(data) ? data : data.posts ?? []
        setPosts(uniquePosts(nextPosts))
        setError('')
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadPosts()

    return () => controller.abort()
  }, [query])

  return (
    <main className="posts-page">
      <header className="posts-header">
        <h1>Posts</h1>
        <label className="search-field">
          <span>Search posts</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter by title or content"
          />
        </label>
      </header>

      {isLoading && <p className="status">Loading posts...</p>}

      {error && <p className="status status-error">Could not load posts: {error}</p>}

      {!isLoading && !error && posts.length === 0 && (
        <p className="status">No posts found{query ? ` for "${query}"` : ''}.</p>
      )}

      {!isLoading && !error && <section className="posts-grid" aria-label="Posts list">
        {posts.map((post) => (
          <article className="post-card" key={post.id ?? post.title}>
            <h2>{post.title }</h2>
            <p>{post.author}</p>
            <p>{post.content}</p>
          </article>
        ))}
      </section>}
    </main>
  )
}


export default Posts;
