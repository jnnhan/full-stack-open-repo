const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

afterAll(async () => {
    await mongoose.connection.close()
})

test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('returned blogs have an id field', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "How to Finance a Guitar (the basics)",
        author: "Bobby Kittleberger",
        url: "https://www.guitarchalk.com/finance-guitars/",
        likes: 3
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)
        
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContainEqual('How to Finance a Guitar (the basics)')
})

test('new blog entry has zero likes if not otherwise specified', async () => {
    const newBlog = {
        title: "How to Finance a Guitar (the basics)",
        author: "Bobby Kittleberger",
        url: "https://www.guitarchalk.com/finance-guitars/"
    }

    await api.post('/api/blogs')
        .send(newBlog)

    const latest = await helper.latestBlog()

    expect(latest.likes).toEqual(0)
})

test('status code 404 is sent if new blog has no title or url field', async() => {
    const badBlog = {
        title: "400 Blog",
        author: "Bad Writer",
    }

    await api.post('/api/blogs')
        .send(badBlog)
        .expect(400)
})