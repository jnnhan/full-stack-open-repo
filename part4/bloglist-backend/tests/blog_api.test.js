const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
})

describe('when there are initally some blogs saved', () => {
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
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "How to Finance a Guitar (the basics)",
            author: "Bobby Kittleberger",
            url: "https://www.guitarchalk.com/finance-guitars/",
            likes: 3
        }

        const user = await helper.initialUser()
    
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${user.token}`)
            .send(newBlog)
            .expect(201)
    
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

        const user = await helper.initialUser()
    
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${user.token}`)
            .send(newBlog)
    
        const latest = await helper.latestBlog()
    
        expect(latest.likes).toEqual(0)
    })

    test('status code 404 is sent if new blog has no title or url field', async() => {
        const badBlog = {
            title: "400 Blog",
            author: "Bad Writer",
        }

        const user = await helper.initialUser()
    
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${user.token}`)
            .send(badBlog)
            .expect(400)
    })

    test('creation fails with status code 401 if user token is not provided', async () => {
        const newBlog = {
            title: "How to Finance a Guitar (the basics)",
            author: "Bobby Kittleberger",
            url: "https://www.guitarchalk.com/finance-guitars/"
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })
})

describe('updating a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToEdit = blogsAtStart[0]

        const updatedBlog = {
            likes: 20
        }
        await api.put(`/api/blogs/${blogToEdit.id}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const editedBlog = blogsAtEnd[0]

        expect(editedBlog.likes).not.toContainEqual(blogToEdit.likes)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const newBlog = {
            title: "How to Finance a Guitar (the basics)",
            author: "Bobby Kittleberger",
            url: "https://www.guitarchalk.com/finance-guitars/",
            likes: 3
        }

        const user = await helper.initialUser()
    
        await api.post('/api/blogs')
            .set('Authorization', `Bearer ${user.token}`)
            .send(newBlog)
        
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[blogsAtStart.length - 1]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${user.token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })
})

describe('when there is already one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('salainen', 10)
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    test('creation succeeds with new username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'karhunen',
            name: 'Otso Hunajainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test(`creation fails with status code 400 and a proper message if username is 
    already taken`, async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'matti',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test(`creation fails with a proper status code and message if username or
    password is invalid`, async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ha',
            name: 'anna',
            password: 'salainen'
        }

        let result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(result.body.error).toContain(`User validation failed: username`)

        let usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)

        const newUserTwo = {
            username: 'bumblebee',
            name: 'justin timberlake',
            password: 'ko'
        }

        result = await api
            .post('/api/users')
            .send(newUserTwo)
            .expect(400)

        expect(result.body.error).toContain(`invalid password`)

        usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
