const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
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
    let newBlog = new Blog(initalBlogs[0])
    await newBlog.save()
    newBlog = new Blog(initalBlogs[1])
    await newBlog.save()
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
        const result = await api.post('/api/blogs').send(newBlog).expect(201)
        const secondResult = await api.get('/api/blogs')
        const filteredArr = secondResult._body.map(a => a.title);
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

            console.log("newBlog is", newBlog)

            const blogs = await api.post('/api/blogs').send(newBlog)
            console.log("blogs is",blogs)
            const blogList = await api.get('/api/blogs')
            console.log("blogList is",blogList)

            expect(blogList).toBe(5)
    })
})

afterAll(() => {
    mongoose.connection.close()
},100000)

//npm test -- tests/blog_api.test.js --silent=false

//npm test -- tests/blog_api.test.js --verbose false