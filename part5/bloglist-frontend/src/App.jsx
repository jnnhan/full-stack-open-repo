import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(false)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
      showNotification(`user ${username} logged in`, "info")
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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, "info")
    } catch (exception) {
      showNotification(exception.message)
    }
  }

  const blogFormRef = useRef()

  return (
    <div>
      {!user && <div>
        <h2>log in to application</h2>
        <Notification message={notification} error={error}/>
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
        <Notification message={notification} error={error}/>
        <p>{user.name} logged in
        <button
          onClick={() => handleLogout()}>logout
        </button><br/>
        <br/></p>
        <Togglable buttonLabel="new blog" buttonHide="cancel" ref={blogFormRef}>
        <BlogForm
          createBlog={addBlog}
        />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}</div>}
    </div>
  )
}

export default App