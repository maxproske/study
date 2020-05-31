const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const axios = require('axios')
const Papa = require('papaparse')

// Utilities
const { parseDuration } = require('./utils')

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

const togglConfig = {
  v9APIUrl: 'https://toggl.com/api/v9',
  v2ReportsUrl: 'https://toggl.com/reports/api/v2',
  v3ReportsUrl: 'https://toggl.com/reports/api/v3',
  userAgent: 'max@mproske.com',
  workspaceId: 1682009,
}

// Routes
app.get('/api/projects', async (req, res) => {
  const { v9APIUrl } = togglConfig

  // TODO: Cache this using redis or something
  const url = `${v9APIUrl}/me/projects`
  const projects = await axiosInstance
    .get(url)
    .then((res) => res.data)
    .catch((err) => err)

  return res.json(projects)
})

app.get('/api/details/v2', async (req, res) => {
  const { v2ReportsUrl, userAgent, workspaceId } = togglConfig

  // Note: Maximum date range is 365 days
  const since = '2017-01-01'
  const until = '2017-12-31'
  const page = 1
  const url = `${v2ReportsUrl}/details.json?user_agent=${userAgent}&workspace_id=${workspaceId}&since=${since}&until=${until}&page=${page}`
  const details = await axiosInstance
    .get(url)
    .then((res) => res.data)
    .catch((err) => err)

  return res.json(details)
})

app.get('/api/details/v3', async (req, res) => {
  const { v3ReportsUrl, userAgent, workspaceId } = togglConfig

  // Note: Maximum allowed date range is 1 year
  const startDate = '2017-01-01'
  const endDate = '2017-12-31'

  // Note: Without the .csv extension we're limited to 50 time entries, with no way to paginate
  const url = `${v3ReportsUrl}/workspace/${workspaceId}/search/time_entries.csv`
  const body = {
    user_agent: userAgent,
    start_date: startDate,
    end_date: endDate,
  }

  let details = await axiosInstance
    .post(url, body)
    .then((res) => {
      const parseConfig = {
        header: true, // Use key-value pairs
        dynamicTyping: true, // Use integers/null
        // Format headers
        transformHeader: (header) => {
          header = header.toLowerCase() // Expect lowercase key
          header = header.split(' ').join('_') // Replace spaces in key with underscores
          return header
        },
      }
      const parsed = Papa.parse(res.data, parseConfig)

      return parsed.data
    })
    .catch((err) => err.response)

  // Filter invalid entries
  details = details.filter((detail) => {
    return detail.duration
  })

  // Format values
  details = details.map((detail) => {
    return {
      ...detail,
      duration: parseDuration(detail.duration), // '00:25:00' → 1500
    }
  })

  // Error handling
  if (details.status) {
    return res.status(details.status).json({
      code: details.status.toString(),
      message: details.statusText,
    })
  }

  return res.json(details)
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
