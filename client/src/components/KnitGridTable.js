import React, {Component} from 'react';
import {Table, Label} from 'semantic-ui-react';
import {DragDropContainer, DropTarget} from 'react-drag-drop-container';

class KnitGridTable extends Component {

  currentRowLabelDropped = (e) => {
    console.log("Dropped!");
    console.log("I was dropped on " + e.dropData.id);
    this.props.cellSelected(e.dropData.id);
  };

  rowCells = (row) => {
    return row.cells.map(cell => {
      let draggableLabel = null;
      if (cell.id === this.props.selectedCellId) {
        draggableLabel = (
            <DragDropContainer
                targetKey="currentRow"
                onDrop={this.currentRowLabelDropped}>
              <Label color="green"></Label>
            </DragDropContainer>)
      }
      return (

          <Table.Cell selectable
                      active={cell.id === this.props.selectedCellId}
                      key={cell.id}
          style={{height: "1px"}}>


            <DropTarget targetKey="currentRow"
                        dropData={{id: cell.id}}
                        style={{
                          height: "100%",
                          width: "100%",
                          minWidth: "50px"
                        }}>

              <div className="my_target"
                   id={cell.id}
                   style={{
                     height: "100%",
                     width: "100%",
                     position: "relative",
                     minWidth: "50px",
                     display: "inline-block"
                   }}>{draggableLabel}{cell.value}</div>
            </DropTarget>
          </Table.Cell>

      )
    })
  };

  isCurrentRow = (row) => {
    return row.cells.find(cell => {
      return cell.id === this.props.selectedCellId;
    });
  };

  componentDidMount = () => {
    console.log("[KnitGridTable]: componentDidMount");
  }

  render() {

    console.log("[KnitGridTable]: render");
    const tableRows = this.props.knitgrid.grid.map((row, i) => {
      let label = null;
      if (this.isCurrentRow(row)) {
        label = (<Label ribbon color="green">Current row</Label>);
      }
      return (
          <Table.Row key={row.id}>
            <Table.Cell singleLine={true} key={"Row" + (i + 1)}>
              {label}
              {"Row " + (i + 1)}
            </Table.Cell>
            {this.rowCells(row)}
          </Table.Row>
      )
    });

    return (
        <div>
          <Table celled selectable definition>
            <Table.Header>
            </Table.Header>
            <Table.Body>
              {tableRows}
            </Table.Body>
            <Table.Footer>
            </Table.Footer>
          </Table>
        </div>
    )
  }
}

export default KnitGridTable;
