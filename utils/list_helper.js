const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    sum = 0;
    for(var i = 0; i < blogs.length; i++){
        sum += blogs[i].likes;
    }
    return sum;
}

const favoriteBlog = (blog) => {
    const preArray = blog.map(a => a.likes)
    const objArr = Math.max(...preArray)

    const favBlog = blog.filter((x) => x.likes == objArr);
    const favBlogObj = favBlog[0]

    delete favBlogObj._id;
    delete favBlogObj.__v;
    delete favBlogObj.url;

    return favBlogObj

}

const mostBlogs = (blogs) => {
    
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}