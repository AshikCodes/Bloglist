const blogRouter = require('express').Router();
const req = require('express/lib/request');
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
require('dotenv').config()


blogRouter.get('/', (request, response) => {
    Blog
      .find({}).populate('user', {username: 1, name: 1})
      .then(blogs => {
        response.status(200).json(blogs)
      })
  })
  
  blogRouter.post('/', async (request, response) => {
    console.log("Request body of blog is",request.body)

    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id){
      response.status(401).json({error: "token missing or invalid"})
    }

    const body = request.body

    var user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      title: body.title,
      author:body.author,
      url: body.url,
      likes: body.likes,
      user: user._id

    })


    console.log("newBlog is",newBlog)

    if (newBlog.title == null && newBlog.url == null){
      response.status(400)
      res.end()
    }
    else{
      newBlog.save()
      user.blog = user.blog.concat(newBlog._id)
      user.save()
      .then(result => {
        console.log("Saved to database!!!!!")
        response.status(201).json(result)
      })
      .catch(error => {
        console.log("Could not save to database")
      })
    }
  })

  blogRouter.delete('/:id', async (request,response) => {
    const id = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    
    if(!decodedToken.id){
      response.status(404).json({error: "token missing or invalid"})
    }

    const blog = await Blog.findById(id)

    if(blog.user.toString() == decodedToken.id){
      const deletedBlog = await Blog.findByIdAndDelete(blog)
      response.json("Successfully deleted blog")
    }
    else {
      response.status(401).json("Error, only creator can delete")
    }
    
  })

  blogRouter.put('/:id', async (request,response) => {
    const id = request.params.id
    const updated = request.body

    const blog = {
      likes: updated.likes
    }
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(id, blog, {new:true})
      response.json("Successfully updated blog")
    }
    catch {
      response.json("Error updating blog")
    }
    

  })

  module.exports = blogRouter