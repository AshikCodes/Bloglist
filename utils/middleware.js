const {info,error} = require('./logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const requestLogger = (req,res,next) => {
    info("Method:", req.method)
    info("Path:", req.path)
    info("Body:", req.body)
    info('-------')
    next();
}


const unknownEndpoint = (req,res) => {
    res.status(404).json({error: "Unknown endpoint"})
}

const errorHandler = (error,request,res,next) => {
    info(error.message)
    info("Error name is", error.name)

    if (error.name === 'CastError') {
        console.log("cast error")
        return response.status(400).send({ error: 'malformatted id' })
      }
    
    if (error.name === 'ValidationError') {
        console.log("Got here")
        return res.status(400).send({ error: 'Username must be bigger than 3 characters'})
    }
    
      next(error)

}

const tokenExtractor = (request,response,next) => {

    const authorization = request.get('Authorization')
    var ifToken = ''

        if(authorization && authorization.toLowerCase().startsWith('bearer ')){
          ifToken = authorization.substring(7)
          request.token = ifToken
        }
        else {
          request.token = null
        }
        next()
}

const userExtractor = async (request,response,next) => {

  const authorization = request.get("Authorization")
  var ifToken = ''

  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    ifToken = authorization.substring(7)
    var decoded = jwt.verify(ifToken, process.env.SECRET)

    if(decoded.id){
      const user = await User.findById(decoded.id)
      request.user = user
    }

  }
  next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}