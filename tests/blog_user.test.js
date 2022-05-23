const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)


beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('12345',10)

    const firstUser = new User(
        {
            username: "Big Mark",
            password: passwordHash,
            name:"Mark"
        }
    )

    await firstUser.save()
})

describe('user tests', () => {
    test('add user to database', async () => {
        const newUser = {
            username: 'smart',
            password: 'dvsgfd',
            name: 'Kevin'
        }

        const result = await api.post('/api/users').send(newUser).expect(201)
        const length = await api.get('/api/users')
        expect(length._body).toHaveLength(2)

        console.log("length is", length)
    })
    test('see if fetching works', async () => {
        const fetchedUsers = await api.get('/api/users').expect(201)
    })

    test('returns 404 error if username already exists', async () => {
        const sameUser = 
        {
            username: "Big Mark",
            password: "123231",
            name:"Mark"
        }

        const notSaved = await api.post('/api/users').send(sameUser).expect({error: "Username must be unique"})
    })

    test('returns 400 error if username/password is too short', async () => {
        const sameUser = 
        {
            username: "as",
            password: "xx2",
            name:"Mark"
        }

        const notSaved = await api.post('/api/users').send(sameUser).expect(400)
        const users = await api.get('/api/users')
        expect(users._body).toHaveLength(1)
    },)

})

afterAll(() => {
    mongoose.connection.close()
},100000)



//npm test -- tests/blog_user.test.js --silent=false

//npm test -- -t 'returns 400 error if username/password is too short'