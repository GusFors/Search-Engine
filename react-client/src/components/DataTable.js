import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

function DataTable({ rows = [], cells = [] }) {
  return (
    <TableContainer component={Paper}>
      <Table style={{}} sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell >{cells[0]}</TableCell>
            <TableCell align='right'>{cells[1]}</TableCell>
            <TableCell align='right'>{cells[2]}</TableCell>
            <TableCell align='right'>{cells[3]}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                <a rel="noreferrer" target='_blank' href={decodeURIComponent(row.url)}>
                  {' '}
                  {decodeURIComponent(row.url)}
                </a>
              </TableCell>

              <TableCell sx={{color: 'cyan'}} className="score" align='right'>{row.score.toFixed(2)}</TableCell>
              <TableCell sx={{color: 'cyan'}} className="score" align='right'>{row.content ? row.content.toFixed(2) : row.score.toFixed(2)}</TableCell>
              <TableCell sx={{color: 'cyan'}} className="score" align='right'>{row.location ? row.location.toFixed(2) : '0.00'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable
