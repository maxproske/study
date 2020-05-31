import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

// Services
import { getAllProjects } from './services/projects'
import { getAllEntries } from './services/entries'

// Styling
const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1rem);
  grid-gap: 0.1725rem;
`

const StyledBlock = styled.div`
  background-color: ${({ color }) => color || 'lightgrey'};
  width: 1rem;
  height: 1rem;
`

export const App = () => {
  const [projects, setProjects] = useState(null)
  const [entries, setEntries] = useState(null)

  // Get projects
  useEffect(() => {
    const getProjects = async () => {
      const projectsUpdate = await getAllProjects()
      console.log('GET PROJECTS: ', projectsUpdate)
      setProjects(projectsUpdate)
    }

    if (!projects) {
      getProjects()
    }
  }, [projects])

  // Get entries
  useEffect(() => {
    const getEntries = async () => {
      const entriesUpdate = await getAllEntries()
      console.log('GET ENTRIES: ', entriesUpdate)
      setEntries(entriesUpdate)
    }

    if (projects && !entries) {
      getEntries()
    }
  }, [projects, entries])

  return (
    <section>
      <h1>Study Tracker</h1>

      <article>
        <h2>Projects</h2>
        {projects &&
          projects.length > 0 &&
          projects.map((project) => {
            return (
              <div key={project.id} style={{ backgroundColor: project.color }}>
                {project.name}
              </div>
            )
          })}
      </article>
      <article>
        <h2>Entries</h2>
        <StyledGrid>
          {entries &&
            entries.length > 0 &&
            entries.map((entry) => {
              return (
                <acronym title={entry.project}>
                  <StyledBlock color={projects.find((project) => project.name === entry.project).color} />
                </acronym>
              )
            })}
        </StyledGrid>
      </article>
    </section>
  )
}
