import { useRef, useState, useEffect } from 'react'
import blogService from '../services/blogs'
import Togglable from "./Togglable"

const Blog = ({ thisBlog, user, showNotification, setBlogs }) => {
  const [blog, setBlog] = useState(thisBlog)
  const [userId, setUserId] = useState(null)
  const blogInfoRef = useRef()

  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await blogService.getUserId(user)
        setUserId(id)
      } catch (error) {
        showNotification("could not get user id", "error")
      }
    }
    getUserId()
  }, [user])

  const handleLike = async () => {
    const updatedBlog = await blogService.update({ ...blog, likes: blog.likes + 1})
    setBlog(updatedBlog)
  }

  const checkUserId = () => {
    if (blog.user) {
      return userId === blog.user.id
    }
    return null
  }

  const handleDelete = async () => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        const deletedBlog = await blogService.deleteBlog(blog)
        if (deletedBlog) {
          showNotification(`Succesfully removed blog ${blog.title} by ${blog.author}`)
          setBlogs((blogs) => blogs.filter(b => b.id !== blog.id))
        }
      }
    } catch (error) {
      showNotification("could not delete blog", "error")
    }
  }

  return (
    <div>
      <div className="blog">
        {blog.title} - {blog.author}
        <Togglable buttonLabel="view" buttonHide="hide" ref={blogInfoRef}>
          <div>
            <p>{blog.url}</p>
            <p>likes: {blog.likes}<button onClick={handleLike}>like</button></p>
            {blog.user && <p>added by {blog.user.name}</p>}
            {checkUserId() && <button onClick={handleDelete}>remove</button>}
          </div>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog