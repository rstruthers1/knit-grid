import React from 'react'

const gridcell = (props) => {
  return (
      <td key={props.cell.id}>
        <input
            type="text"
            value={props.cell.value}
            onChange={(event) => props.changed(event, props.rowId, props.cell.id)}
        />
      </td>
  )
}

export default gridcell
