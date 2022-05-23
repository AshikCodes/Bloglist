const userRouter = require('express').Router()
// const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')

userRouter.post('/', async (request,response) => {
    console.log("request body is", request.body)
    const {username,password,name} = request.body

    const alreadyThere = await User.findOne({username})

    if(password.length < 3){
        response.status(400).json({error: "Username and password must be bigger than 3 characters"})
    }
// && username.length > 2 && password.length > 2
    if(alreadyThere == null) {
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
    }
    else {
        response.status(404).json({error: "Username must be unique"})
    }
})

userRouter.get('/', async(request,response) => {
    const users = await User.find({})
    response.status(201).json(users)
})






module.exports = userRouter