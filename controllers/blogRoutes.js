const blogRouter = require('express').Router();
const Blog = require('../models/blog')


blogRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.status(200).json(blogs)
      })
  })
  
  blogRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    if (blog.title == null && blog.url == null){
      response.status(400)
      res.end()
    }
    else{
      blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
    }
  })

  blogRouter.delete('/:id', async (request,response) => {
    const id = request.params.id;

    try{
      const deletedBlog = await Blog.findByIdAndDelete(id)
      response.json("Successfully deleted blog")
    }
    catch {
      response.json("Error deleting blog")
    }
    
  })

  module.exports = blogRouter