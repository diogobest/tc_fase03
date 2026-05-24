import { useEffect, useState } from 'react'


type Post = {
  id?: string | number
  title?: string
  body?: string
  content?: string
  description?: string
}
type PostsResponse = Post[] | { posts?: Post[] }

const POSTS_URL = '/api/posts'

function Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadPosts() {
      try {
        const response = await fetch(POSTS_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = (await response.json()) as PostsResponse
        setPosts(Array.isArray(data) ? data : data.posts ?? [])
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
  }, [])

  return (
    <main className="posts-page">
      <header className="posts-header">
        <p className="eyebrow">External app</p>
        <h1>Posts</h1>
        <p>Loaded from <code>http://localhost:3030/posts</code></p>
      </header>

      {isLoading && <p className="status">Loading posts...</p>}

      {error && <p className="status status-error">Could not load posts: {error}</p>}

      {!isLoading && !error && posts.length === 0 && (
        <p className="status">No posts found.</p>
      )}

      <section className="posts-grid" aria-label="Posts list">
        {posts.map((post) => (
          <article className="post-card" key={post.id ?? post.title}>
            <h2>{post.title ?? 'Untitled post'}</h2>
            <p>{post.body ?? post.content ?? post.description ?? ''}</p>
          </article>
        ))}
      </section>
    </main>
  )
}

