import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(false)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs))
  }, [])

  const showNotification = (message, type='info') => {
    if (type === 'error') {
      setError(true)
    }
    setNotification(message)
    console.log(message)

    setTimeout(() => {
      setNotification(null)
      setError(false)
    }, 5000)
  }

  const clearForm = () => {
    setUsername('')
    setPassword('')
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      clearForm()
    } catch (exception) {
      showNotification('wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')

    blogService.setToken(null)
    setUser(null)
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  const addBlog = async (e) => {
    e.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }

    try {
      const returnedBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(returnedBlog))
      clearForm()
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  return (
    <div>
      {!user && <div>
        <h2>log in to application</h2>
        <LoginForm
          loginHandler={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}/>
      </div>
      }
      {user && <div>
        <h2>blogs</h2>
        {user.name} logged in
        <button
          onClick={() => handleLogout()}>logout
        </button>

        <h2>add new blog to the list</h2>
        {blogForm()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}</div>}
    </div>
  )
}

export default App