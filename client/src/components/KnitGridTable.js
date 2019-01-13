import React, {Component} from 'react'
import {Table} from 'semantic-ui-react'

class KnitGridTable extends Component {

  tableCells = (row) => {
    return row.cells.map(cell => {
      if (cell.selected) {
        return <Table.Cell selectable active><a
            href="#">{cell.value}</a></Table.Cell>
      } else {
        return <Table.Cell selectable><a href="#">{cell.value}</a></Table.Cell>
      }
    })
  }

  render() {

    const tableRows = this.props.knitgrid.grid.map((row, i) => {
      return (
          <Table.Row>
            <Table.Cell singleLine={true}>{"Row " + (i + 1)}</Table.Cell>
            {this.tableCells(row)}
          </Table.Row>
      )
    });
    return (
        <Table celled selectable definition>
          <Table.Header>

          </Table.Header>

          <Table.Body>
            {tableRows}
          </Table.Body>

          <Table.Footer>

          </Table.Footer>
        </Table>
    )
  }
}

export default KnitGridTable;