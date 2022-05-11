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
    console.log("before is",blog.map(a => a.likes) )
    const preArray = blog.map(a => a.likes)
    console.log("Math max thing is", Math.max(...preArray))
    const objArr = Math.max(...preArray)

    console.log("objArr is",objArr)

    const favBlog = blog.filter((x) => x.likes == objArr);
    const favBlogObj = favBlog[0]

    delete favBlogObj._id;
    delete favBlogObj.__v;
    delete favBlogObj.url;

    console.log("Fav blog is now",favBlog)


    return favBlogObj

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}