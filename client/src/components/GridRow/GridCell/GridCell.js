import React from 'react'

import '../../../containers/App.css';

const gridcell = (props) => {
  let inputStyle = {backgroundColor: 'white' }
  if (props.cell.selected) {
    inputStyle.backgroundColor = 'lightgreen'
  }

  if (!props.cell.selected && props.rowSelected) {
    inputStyle.backgroundColor = 'yellow'
  }

  return (
      <td className="tooltip">
        <input
            className="myInput"
            style={inputStyle}
            type="text"
            value={props.cell.value}
            onChange={(event) => props.changed(event, props.rowId, props.cell.id)}
            onFocus={(event) => props.onfocus(event, props.rowId, props.cell.id)}
            on
        />
        <span className="tooltiptext">{props.cell.value}</span>
      </td>
  )
}

export default gridcell
