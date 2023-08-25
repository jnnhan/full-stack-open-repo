import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [error, setError] = useState(false)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  useEffect(() => {
      blogService.getAll().then(blogs =>
        setBlogs( blogs ))
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong credentials', 'error')
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
        <p>{user.name} logged in</p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}</div>}
    </div>
  )
}

export default App