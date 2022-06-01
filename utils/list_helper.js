import _ from 'lodash';

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
    console.log("preArry is", preArray)
    const objArr = Math.max(...preArray)

    const favBlog = blog.filter((x) => x.likes == objArr);
    const favBlogObj = favBlog[0]

    delete favBlogObj._id;
    delete favBlogObj.__v;
    delete favBlogObj.url;

    return favBlogObj

}

const mostBlogs = (blog) => {
    // const b = _.maxBy(blog, 'blogs')
    // var highestBlogCnt;

    // for(let i = 0; i < blog.length ; i++){
    //     if(blog[i].blogs = b){
    //         highestBlogCnt = i
    //         break
    //     }
    // }
    
    // const rightBlog = blog[highestBlogCnt]

    var result = _.head(_(blog)
    .countBy('author')
    .entries()
    .maxBy(_.last));

    var blogLength = 0;

    for(let i = 0; i < blog.length; i++){
        if(blog[i].author == result){
            blogLength++
        }
    }

    const rightBlog = {
        author: result,
        blogs: blogLength
    }

    console.log("rightBlog is", rightBlog)

    return rightBlog
  
}

const mostLikes = (blog) => {
    var max = blog[0].likes
    var maxIndex = 0;
    for(let i = 0; i < blog.length; i++){
        if(blog[i].likes > max){
            maxIndex = i;
            max = blog[i]
        }
    }

    const rightBlog = {
        author: max.author,
        likes: max.likes
    }

    return rightBlog
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}