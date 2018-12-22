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
      <td>
        <input
            className="myInput"
            style={inputStyle}
            type="text"
            value={props.cell.value}
            title={props.cell.value}
            onChange={(event) => props.changed(event, props.rowId, props.cell.id)}
            onFocus={(event) => props.onfocus(event, props.rowId, props.cell.id)}
            onDoubleClick={(event) => {alert(props.cell.value)}}
        />
      </td>
  )
}

export default gridcell
