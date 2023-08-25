const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require("../models/blog")
const User = require('../models/user')

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

const initialUser = async () => {
    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User ({
        username: "tester",
        name: "test testersson",
        passwordHash: passwordHash
    })

    await user.save()
    
    const loggedInUser = await api.post('/api/login')
        .send({
            username: user.username,
            password: 'salainen'})
        .expect(200)

    return loggedInUser.body
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({ title: 'Soon to be deleted'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
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
  initialUser,
  blogsInDb,
  usersInDb,
  nonExistingId,
  latestBlog,
  dummy,
  totalLikes,
  favoriteBlog,
}