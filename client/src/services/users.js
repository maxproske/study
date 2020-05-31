import axios from 'axios'

const API = 'http://localhost:5000/api'

export const getUsers = () => {
  const request = axios.get(`${API}/users`)
  return request.then((response) => response.data)
}
