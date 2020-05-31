const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')

const app = express()

// Cors middleware
app.use(cors())

// JSON parsing middleware
app.use(express.json())

// Logging middleware
morgan.token('body', (req) => Object.keys(req.body).length && JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Create axios instance
const axiosInstance = axios.create({
  // Toggl expects API token as username and 'api_token' string as password
  auth: {
    username: process.env.TOGGL_API_TOKEN,
    password: 'api_token',
  },
})

// Routes
app.get('/api/projects', async (req, res) => {
  // TODO: Cache this using redis or something
  const projects = await axiosInstance.get(`https://toggl.com/api/v9/me/projects`).then((response) => response.data)

  return res.json(projects)
})

// Custom middleware to catch non-existant routes
const unknownEndpoint = (req, res) => {
  res.status(404).send({ code: '404', error: 'Unknown endpoint' })
}
app.use(unknownEndpoint)

// Start server
app.listen(5000, () => {
  console.log('server started')
})
