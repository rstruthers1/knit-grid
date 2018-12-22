import React from 'react'

import '../../../containers/App.css';
import Tooltip from '../../../containers/Tooltip'

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
        <Tooltip message={props.cell.value} position={'top'}>
        <input
            className="myInput"
            style={inputStyle}
            type="text"
            value={props.cell.value}
            onChange={(event) => props.changed(event, props.rowId, props.cell.id)}
            onFocus={(event) => props.onfocus(event, props.rowId, props.cell.id)}
        />
        </Tooltip>
      </td>
  )
}

export default gridcell
