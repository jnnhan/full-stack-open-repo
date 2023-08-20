const Blog = require("../models/blog")

const initialBlogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const latestBlog = async () => {
    const latest = await Blog.findOne().sort({ _id: -1})
    return latest.toJSON()
}

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    // Generate a test blog to pass to reduce function in case the tested list is empty
    const first = [
        {
            _id: "0",
            title: "test",
            author: "tester",
            url: "https://fullstackopen.com/",
            likes: -1,
            __v: 0
        }
    ]
    const mostLiked = (blogs) => {
        return blogs.reduce((previous, current) => {
            return (previous.likes > current.likes) ? previous : current
        }, first)
    }

    let result = mostLiked(blogs)

    return (({ title, likes, author }) => ({ title, likes, author}))(result)
}

module.exports = {
  initialBlogs,
  blogsInDb,
  latestBlog,
  dummy,
  totalLikes,
  favoriteBlog,
}