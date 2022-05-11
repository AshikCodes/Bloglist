const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {info,error} = require('./utils/logger')
const Blog = require('./models/blog');
const config = require('./utils/config')
const blogRouter = require('./controllers/blogRoutes');

info("connecting to port", config.PORT, '...')

mongoose.connect(config.MONGO_URL)
 .then((result) => {
   info('MongoDB connected!');
})

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports = app