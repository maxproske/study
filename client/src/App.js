import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

// Services
import { getAllProjects } from './services/projects'
import { getAllEntries } from './services/entries'

// Styling
const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 2vw);
  grid-gap: 2px;
`

const StyledBlock = styled.div`
  background-color: ${({ color }) => color || 'lightgrey'};
  width: 2vw;
  height: 2vw;
`

export const App = () => {
  const [projects, setProjects] = useState(null)
  const [entries, setEntries] = useState(null)
  const [blocks, setBlocks] = useState(null)

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

    if (projects && entries) {
      const data = []
      for (const entry of entries) {
        if (data[entry.project] === undefined) data[entry.project] = []

        data[entry.project].push({
          seconds: entry.seconds,
          start_date: entry.start_date,
        })
      }

      // Binning
      let results = []
      const maxBinSize = 50 * 60 // 50 minutes

      for (let project in data) {
        let binSize = 0
        for (let entry of data[project]) {
          binSize += entry.seconds

          while (binSize >= maxBinSize) {
            results.push({ project, start_date: entry.start_date, seconds: maxBinSize })
            binSize -= maxBinSize
          }
        }
      }

      results = results.sort((a, b) => a.start_date.localeCompare(b.start_date))

      setBlocks(results)
    }
  }, [projects, entries])

  return (
    <section>
      <h1>Study Tracker</h1>

      <StyledGrid>
        {blocks &&
          blocks.map((block) => (
            <acronym title={`${block.project} - ${block.start_date} `}>
              <StyledBlock color={projects.find((project) => project.name === block.project).color} />
            </acronym>
          ))}
      </StyledGrid>
    </section>
  )
}
