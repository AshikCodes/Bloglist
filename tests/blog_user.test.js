const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})
describe('user tests', () => {
    test('add user to database', async () => {
        const newUser = {
            username: 'smart',
            password: 'dvsgfd',
            name: 'Kevin'
        }

        const result = await api.post('/api/users').send(newUser).expect(201)
    })
    test('see if fetching works', async () => {
        const fetchedUsers = await api.get('/api/users').expect(201)
    })
})

afterAll(() => {
    mongoose.connection.close()
},100000)


//npm test -- tests/blog_user.test.js