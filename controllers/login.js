const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const res = require('express/lib/response')
require('dotenv').config()


loginRouter.post('/', async (request,response) => {
    const {username, password} = request.body

    const user = await User.findOne({username})
    const passwordCorrect = user === null 
    ? false 
    : await bcrypt.compare(password, user.password)

    if(!(user && passwordCorrect)){
        response.status(401).json({error: "Incorrect username or password"})
    }
    else {
        const userForToken = {
            username: user.username,
            id: user._id
        }
    
        const token = jwt.sign(userForToken, process.env.SECRET)
    
        response.status(200).send({token, username: user.username, name: user.name})
    }
    
})







module.exports = loginRouter