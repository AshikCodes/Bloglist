const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {info,error} = require('./utils/logger')
const Blog = require('./models/blog');
const config = require('./utils/config')
const blogRouter = require('./controllers/blogRoutes');
const userRouter = require('./controllers/userRoutes')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

info("connecting to port", config.PORT, '...')

mongoose.connect(config.MONGO_URL)
 .then((result) => {
   info('MongoDB connected!');
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users',userRouter)
app.use('/api/login',loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app