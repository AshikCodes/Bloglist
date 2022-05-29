const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initial } = require('lodash')
const api = supertest(app)


const initalBlogs = [
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
        }
        
]


beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    let newBlog = new Blog(initalBlogs[0])
    let newBlog2 = new Blog(initalBlogs[1])
    let newUser = {
        username: "lol123",
        password: "12345",
        name: "Jordan"
    }
    const result = await api.post('/api/users').send(newUser)

    console.log("result is", result._body.savedUser.id)

    newBlog.user = result._body.savedUser.id
    newBlog2.user = result._body.savedUser.id

    await newBlog.save()
    await newBlog2.save()
    


})

describe('blog tests', () => {
    test('returns blog list length', async () => {
        const blogs = await api.get('/api/blogs')
        const result = blogs._body
        expect(result.length).toBe(2)
    })

    test('verify unique identifier is named id', async () => {
        const blogs = await api.get('/api/blogs')
        const result = blogs._body
        result.forEach((element) => {
            expect(element.id).toBeDefined()
        })
    })

    test('adds new blog', async () => {
        const newBlog = {
            title: "Node patterns",
            author: "Cool Chan",
            url: "https://fregrferfref.com/",
            likes: 7
            }
        
        const loginRes = await api.post('/api/login').send({username:'lol123', password: '12345'})
        console.log("loginRes is", loginRes.body)

        const result = await api.post('/api/blogs').send(newBlog).set({Authorization: `bearer ${loginRes.body.token}`}).expect(201)
        const secondResult = await api.get('/api/blogs')

        console.log("Second result is", secondResult._body)
        const filteredArr = secondResult._body.map(a => a.title)
        expect(secondResult._body).toHaveLength(initalBlogs.length + 1)
        expect(filteredArr).toContain('Node patterns')
        
    })

    test('verify if likes property is missing', async () => {
        const newBlog = {
            title: "Jest patterns",
            author: "Cool Chan",
            url: "https://fregrferfref.com/"
            }

            if(newBlog.likes == null){
                newBlog.likes = 0;
            }

            const loginRes = await api.post('/api/login').send({username:'lol123', password: '12345'})
            console.log("loginRes is", loginRes.body)

            const blogs = await api.post('/api/blogs').send(newBlog).set({Authorization: `bearer ${loginRes.body.token}`}).expect(201)
            // const blogs = await api.post('/api/blogs').send(newBlog)
            const blogList = await api.get('/api/blogs')

            const blogBody = blogList._body

            const checkBlog = blogBody.filter((blog) => {return blog.title == newBlog.title})

            expect(checkBlog[0].likes).toEqual(0)
    })

    test('if title and url props missing send 400 err', async () => {
        const newBlog = {
            author: "Cool Chan",
            likes:250
            }
        
        const loginRes = await api.post('/api/login').send({username:'lol123', password: '12345'})
        await api.post('/api/blogs').send(newBlog).set({Authorization: `bearer ${loginRes.body.token}`}).expect(400)
        
        // const result = await api.post('/api/blogs').send(newBlog).expect(400)
    })

    test('test if deleting blog works', async () => {
        const loginRes = await api.post('/api/login').send({username:'lol123', password: '12345'})
        
        const blogToDelete = await Blog.find({
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
            })

        console.log("blog to delete is", blogToDelete)
        const id = blogToDelete[0]._id
        
        const result = await api.delete(`/api/blogs/${id}`).set({Authorization: `bearer ${loginRes.body.token}`}).expect(JSON.stringify("Successfully deleted blog"))
    })

    test('test to update blog', async () => {
        const blogList = await api.get('/api/blogs')

        console.log("BLOGLIST IS", blogList._body)
        const blogToUpdate = await Blog.find({
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
            })
        const id = blogToUpdate[0]._id

        const newBlog = {
            likes: 15
        }

        const updated = await api.put(`/api/blogs/${id}`).send(newBlog).expect(JSON.stringify("Successfully updated blog"))
    })

    test('send 404 error if token is not provided', async() => {
        const newBlog = {
            title: "Node patterns",
            author: "Cool Chan",
            url: "https://fregrferfref.com/",
            likes: 7
            }

        const loginRes = await api.post('/api/login').send({username:'lol123', password: '12345'})
        await api.post('/api/blogs').send(newBlog).expect(401)
    })
})

afterAll(() => {
    mongoose.connection.close()
})

//100000
//npm test -- tests/blog_api.test.js --silent=false

//npm test -- tests/blog_api.test.js --verbose false

//npm test -- -t "adds new blog"

//npm test -- -t "send 404 error if token is not provided"

//npm test -- -t "test if deleting blog works"
