import React, { useEffect } from 'react'

// Services
import { getUsers } from './services/users'

export const App = () => {
  useEffect(() => {
    getUsers()
  }, [])

  return (
    <section>
      <h1>Study</h1>
    </section>
  )
}
