import axios from 'axios'

const API = 'http://localhost:5000/api'

export const getAllProjects = () => {
  const request = axios.get(`${API}/projects`)
  return request.then((response) => response.data)
}
