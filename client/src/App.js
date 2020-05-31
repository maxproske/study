import React, { useState, useEffect } from 'react'

// Services
import { getAllProjects } from './services/projects'

export const App = () => {
  const [projects, setProjects] = useState(null)

  // Get projects
  useEffect(() => {
    const getProjects = async () => {
      const projectsUpdate = await getAllProjects()
      console.log(projectsUpdate)
      setProjects(projectsUpdate)
    }

    if (!projects) {
      getProjects()
    }
  }, [projects])

  return (
    <section>
      <h1>Projects</h1>
      {projects &&
        projects.length > 0 &&
        projects.map((project) => {
          return (
            <div key={project.id} style={{ backgroundColor: project.color }}>
              {project.name}
            </div>
          )
        })}
    </section>
  )
}
