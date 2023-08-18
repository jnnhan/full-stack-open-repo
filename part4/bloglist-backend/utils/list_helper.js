const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    // Generate a test blog to pass to reduce function in case the tested list is empty
    const first = [
        {
            _id: "0",
            title: "test",
            author: "tester",
            url: "https://fullstackopen.com/",
            likes: -1,
            __v: 0
        }
    ]
    const mostLiked = (blogs) => {
        return blogs.reduce((previous, current) => {
            return (previous.likes > current.likes) ? previous : current
        }, first)
    }

    let result = mostLiked(blogs)

    return (({ title, likes, author }) => ({ title, likes, author}))(result)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}