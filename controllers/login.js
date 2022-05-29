const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const res = require('express/lib/response')
require('dotenv').config()


loginRouter.post('/', async (request,response) => {
    const {username, password} = request.body


    const user = await User.findOne({username})
    const trueOrNote = await bcrypt.compare(password, user.password)
    console.log("trueornot is", trueOrNote)

    const passwordCorrect = user === null 
    ? false 
    : await bcrypt.compare(password, user.password)

    if(!(user && passwordCorrect)){
        console.log("User is", user)
        console.log("username is", username)
        console.log("password is", password)
        response.status(401).json({error: "Incorrect username or password"})
    }
    else {
        const userForToken = {
            username: user.username,
            id: user._id
        }
        console.log("GOTT HERE TOKEN IS")
    
        const token = jwt.sign(userForToken, process.env.SECRET)
        console.log("GOTT HERE TOKEN IS", token)
    
        response.status(200).send({token, username: user.username, name: user.name})
    }
    
})







module.exports = loginRouter