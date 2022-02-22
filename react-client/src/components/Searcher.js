import React, { useState } from 'react'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import DataTable from './DataTable'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

function Searcher() {
  const [query, setQuery] = useState('')
  const [searchContent, setRecommendationContent] = useState('')
  const [infoContent, setInfoContent] = useState('')
  const [includeLocation, setIncludeLocation] = useState('False')

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
  }

  const handleIncludeLocation = (event) => {
    setIncludeLocation(event.target.value)
  }

  const handleSearchButtonClick = async (event) => {
    if (query.length > 0) {
      const result = await fetch(`http://localhost:4000/search?search=${encodeURIComponent(query)}&location=${includeLocation}`, {})
      const json = await result.json()

      setRecommendationContent(<DataTable cells={['Link', 'Score', 'Content', 'Location']} rows={json.results}></DataTable>)
      setInfoContent(
        <span style={{ fontSize: '14px' }}>
          Found {json.numResults} results in: {json.time.toFixed(3)}ms
        </span>
      )
    } else {
      setRecommendationContent(<span></span>)
      setInfoContent(<span style={{ fontSize: '14px' }}>Enter some text first!</span>)
    }
  }

  return (
    <Container>
      <div style={{}}>
        <div style={{}}>
          <Stack alignContent='start' direction='row' spacing={0}>
            <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
              <TextField
                id='standard-query'
                label='Search query'
                type='text'
                style={{ minWidth: '100px', borderRadius: '4px', marginRight: '40px' }}
                defaultValue=''
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleQueryChange}
                variant='standard'
              />
            </FormControl>
            <FormControl variant='standard' sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id='select-location-label'>Include Location</InputLabel>
              <Select
                label='location'
                style={{ minWidth: '100px', borderRadius: '4px', marginRight: '40px' }}
                labelId='select-similarity-label'
                id='select-similarity'
                value={includeLocation}
                onChange={handleIncludeLocation}
              >
                <MenuItem value='False'>False</MenuItem>
                <MenuItem value='True'>True</MenuItem>
              </Select>
            </FormControl>

            <Button
              sx={{ m: 1, minWidth: 120 }}
              onClick={handleSearchButtonClick}
              style={{ backgroundColor: '#42c5F5', color: 'white', marginRight: '40px' }}
              variant='contained'
            >
              Search
            </Button>
          </Stack>
        </div>

        <div style={{ marginTop: '40px' }}>{searchContent}</div>
        <div style={{ marginTop: '20px' }}>{infoContent}</div>
      </div>
    </Container>
  )
}

export default Searcher
