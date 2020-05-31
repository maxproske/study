const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

// Cors middleware
app.use(cors())

// JSON parsing middleware
app.use(express.json())

// Logging middleware
morgan.token('body', (req) => Object.keys(req.body).length && JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Routes
app.get('/api/users', (req, res) => {
  res.json([])
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
