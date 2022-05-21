const userRouter = require('express').Router()
// const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request,response) => {
    const {username,password,name} = request.body

    const saltRounds = 10 //How many times password it gonna get hashed (Ex: 2^n times)
    const passwordHash = await bcrypt.hash(password,saltRounds)

    const user = new User(
        {
            username,
            password: passwordHash,
            name
        }
    )

    const savedUser = await user.save()
    
    response.status(201).json({savedUser})
})

userRouter.get('/', async(request,response) => {
    const users = await User.find({})
    response.status(201).json(users)
})






module.exports = userRouter