const userRouter = require('express').Router()
// const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const res = require('express/lib/response')

userRouter.post('/', async (request,response,next) => {
    const {username,password,name} = request.body

    const alreadyThere = await User.findOne({username})

if(username.length < 3 && password.length < 3){
    response.status(400).json({error: "Username and password must be bigger than 3 character"})
}

if(password.length < 3 && username.length >= 3){
    response.status(400).json({error: "Password must be bigger than 3 character"})
}

if(password.length >= 3){
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

        try {
            const savedUser = await user.save()
            response.status(201).json({savedUser})
        }
        catch(error) {
            console.log("Error name is", error.name)
            next(error)
        }
    }
    else {
        response.status(400).json({error: "Username must be unique"})
    }
}

})

userRouter.get('/', async(request,response) => {
    // console.log("rand id", rand)
    const users = await User.find({}).populate('blog', {title: 1, author: 1})
    response.status(201).json(users)
})






module.exports = userRouter