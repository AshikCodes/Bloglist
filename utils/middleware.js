const {info,error} = require('./logger');

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

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } 
    
      next(error)

}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}