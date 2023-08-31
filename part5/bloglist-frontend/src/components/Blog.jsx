import { useRef } from 'react'
import Togglable from "./Togglable"

const Blog = ({ blog }) => {
  const blogInfoRef = useRef()

  console.log(blog.user)

  const handleLike = () => {
    return
  }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <div className="blog">
        <p>{blog.title} - {blog.author}</p>
        <Togglable buttonLabel="view" buttonHide="hide" ref={blogInfoRef}>
          <div>
            <p>{blog.url}</p>
            <p>likes: {blog.likes}<button onClick={handleLike}>like</button></p>
            {blog.user && <p>added by {blog.user.name}</p>}
          </div>
        </Togglable>
      </div>
    </div>
  )
}

export default Blog