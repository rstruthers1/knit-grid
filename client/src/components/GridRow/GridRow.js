import React, {Component} from 'react'
import GridCell from './GridCell/GridCell'

class GridRow extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.didCellChange(nextProps)
  }

  didCellChange = (nextProps) => {

    if (!nextProps.row.cells && this.props.row.cells) {
      return true;
    }
    if (nextProps.row.cells && !this.props.row.cells) {
      return true;
    }

    if (nextProps.row.cells.length !== this.props.row.cells.length) {
      return true;
    }

    for (let i = 0; i < nextProps.row.cells.length; i++) {
      let nextCell = nextProps.row.cells[i]
      let cell = this.props.row.cells[i]
      if (nextCell.selected !== cell.selected) {
        return true;
      }
      if (nextCell.value !== cell.value) {
        return true;
      }
    }
    return false;
  }

  render() {
    let cell = this.props.row.cells.find((cell) => {
      return cell.selected
    })

    let rowSelected = false

    if (cell) {
      rowSelected = true
    }

    return (
        <tr>
          {
            this.props.row.cells.map((cell) => {
              return (
                  <GridCell cell={cell}
                            rowId={this.props.row.id}
                            changed={this.props.changed}
                            onfocus={this.props.onfocus}
                            rowSelected={rowSelected}
                            key={cell.id}/>
              )
            })
          }
        </tr>
    )
  }
}

export default GridRow
