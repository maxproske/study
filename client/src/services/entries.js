import axios from 'axios'

const API = 'http://localhost:5000/api'

export const getAllEntries = () => {
  const request = axios.get(`${API}/entries`)
  return request.then((response) => response.data)
}
