import React from 'react'
import GridCell from './GridCell/GridCell'

const gridrow = (props) => {
  let cell = props.row.cells.find((cell) => {
      return cell.selected
  })

  let rowSelected = false

  if (cell) {
    rowSelected = true
  }

  return (
      <tr>
        {
          props.row.cells.map((cell) => {
            return (
                <GridCell cell={cell}
                          rowId={props.row.id}
                          changed={props.changed}
                          onfocus={props.onfocus}
                          rowSelected={rowSelected}
                          key={cell.id}/>
            )
          })
        }
      </tr>
  )
}

export default gridrow
