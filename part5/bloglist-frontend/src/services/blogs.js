import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async blogObject => {
  const config = {
    headers: { Authorization: token },
  }
  
  const response = await axios.post(baseUrl, blogObject, config)
  return response.data
}

export default { getAll, create, setToken }