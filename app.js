const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const {info,error} = require('./utils/logger')
const Blog = require('./models/blog');
const config = require('./utils/config')


mongoose.connect(config.MONGO_URL)
 .then((result) => {
   info('MongoDB connected!');
})

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

module.exports = app