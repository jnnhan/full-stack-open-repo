import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  const blogs = request.data.sort((a, b) => b.likes - a.likes)

  return blogs
}

const deleteBlog = async (blog) => {
  try {
    const config = {
      headers: { Authorization: token },
    }

    const url = `${baseUrl}/${blog.id}`
    const response = await axios.delete(url, config)
    if (response.status === 204) {
      return true
    } else {
      throw new Error("error deleting the blog")
    }
  } catch (error) {
    console.log("error occured while deleting blog")
    return false
  }
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

const getUserId = async (user) => {
  try {
    const response = await axios.get('http://localhost:3003/api/users')
    const userData = response.data.find((u => u.name === user.name))
    return userData.id
  } catch (error) {
    console.log("error")
    return null
  }
}

const update = async blogObject => {
  const url = `${baseUrl}/${blogObject.id}`
  const response = await axios.put(url, blogObject)
  return response.data
}

export default { getAll, deleteBlog, create, update, getUserId, setToken }