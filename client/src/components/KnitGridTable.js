import React, {Component} from 'react';
import {Table, Label, Icon, Button} from 'semantic-ui-react';
import {DragDropContainer, DropTarget} from 'react-drag-drop-container';
import {MenuItemIds} from '../constants/Constants';

class KnitGridTable extends Component {

  state = {
    rowIndex: -1,
    columnIndex: -1
  };

  componentDidMount() {
    this.scrollDragLabelIntoView();
    if (this.props.registerKeyboardShortcut) {
      this.props.registerKeyboardShortcut(this.navigateWithKeyboard);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //if (prevState.rowIndex !== this.state.rowIndex) {
    //   this.scrollDragLabelIntoView();
    //}
  }

  setRowAndColumnIndex = (grid, rowIndex, columnIndex) => {
    this.setState({
      rowIndex: rowIndex,
      columnIndex: columnIndex
    });
    if (rowIndex >= 0 && columnIndex >= 0) {
      this.props.cellSelected(grid[rowIndex].cells[columnIndex].id);
    }
  };

  scrollDragLabelIntoView() {
    const el = document.getElementById('dragLabel');
    if (!el) {
      return;
    }
    // if (this.isScrolledIntoView(el)) {
    //   return;
    // }
    el.scrollIntoView();
    const scrolledY = window.scrollY;

    if (scrolledY) {
      window.scroll(0, scrolledY - 70);
    }
  }

  isScrolledIntoView(el) {
    let rect = el.getBoundingClientRect();
    let elemTop = rect.top;
    let elemBottom = rect.bottom;

    // Only completely visible elements return true:
    let isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
  }

  handleMarkerInputChange = (event) => {
    this.processNavigationInput(event.target.value);
  };

  navigateWithKeyboard = (event) => {
    const keyChar = String.fromCharCode(event.keyCode);
    console.log("keypress event detected, key is: " + keyChar);
    this.processNavigationInput(keyChar);
  };

  processNavigationInput = (keyChar) => {
    keyChar = keyChar.toLowerCase();
    switch (keyChar) {
      case "n":
        console.log("navigating to next cell");
        this.goToNextCell();
        break;
      case "b":
        console.log("navigating to previous cell");
        this.goToPreviousCell();
        break;
      case "z":
        console.log("navigating to first cell in next row");
        this.goToFirstCellInNextRow();
        break;
      case "s":
        console.log("saving project");
        this.props.handleMenuSelection(MenuItemIds.SAVE_PROJECT);
        break;
      default:
        console.log("key not registered");
    }
  };

  goToFirstCellInNextRow = () => {
    const grid = this.props.knitgrid.grid;
    let nextRowIndex = -1;
    let nextColumnIndex = -1;

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.id === this.props.selectedCellId) {
          nextRowIndex = i + 1;
          if (nextRowIndex === grid.length) {
            nextRowIndex = 0;
          }
          nextColumnIndex = 0;
          break;
        }
      }
      if (nextRowIndex >= 0) {
        break;
      }
    }
    this.setRowAndColumnIndex(grid, nextRowIndex, nextColumnIndex);

  };

  goToNextCell = () => {
    const grid = this.props.knitgrid.grid;
    let nextRowIndex = -1;
    let nextColumnIndex = -1;

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.id === this.props.selectedCellId) {
          nextRowIndex = i;
          nextColumnIndex = j + 1;
          if (nextColumnIndex === row.cells.length) {
            nextColumnIndex = 0;
            nextRowIndex = i + 1;
            if (nextRowIndex === grid.length) {
              nextRowIndex = 0;
            }
          }
          break;
        }
      }
      if (nextRowIndex >= 0) {
        break;
      }
    }
    this.setRowAndColumnIndex(grid, nextRowIndex, nextColumnIndex);
  };

  goToPreviousCell = () => {
    const grid = this.props.knitgrid.grid;
    let nextRowIndex = -1;
    let nextColumnIndex = -1;

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.id === this.props.selectedCellId) {
          nextRowIndex = i;
          nextColumnIndex = j - 1;
          if (nextColumnIndex < 0) {
            nextRowIndex = i - 1;
            if (nextRowIndex < 0) {
              nextRowIndex = grid.length - 1;
            }
            nextColumnIndex = grid[nextRowIndex].cells.length - 1;
          }
          break;
        }
      }
      if (nextRowIndex >= 0) {
        break;
      }
    }
    this.setRowAndColumnIndex(grid, nextRowIndex, nextColumnIndex);
  };

  currentRowLabelDropped = (e) => {
    this.props.cellSelected(e.dropData.id);
  };

  rowCells = (row) => {
    return row.cells.map(cell => {
      let draggableLabel = null;
      let lastSavedMarkerPositionLabel = null;
        if (cell.id === this.props.selectedCellId) {
          draggableLabel = (
              <DragDropContainer
                  targetKey="currentRow"
                  onDrop={this.currentRowLabelDropped}>
                <Label color="green">
                  <div className="ui focus transparent input" id="dragLabel">
                    <input type="text"
                           onChange={this.handleMarkerInputChange}
                           style={{
                             width: "1em",
                             height: "1em",
                             cursor: "all-scroll"
                           }}/>
                  </div>
                </Label>
              </DragDropContainer>)
        } else if (cell.id === this.props.lastSavedSelectedCellId) {
          lastSavedMarkerPositionLabel = (
              <Label color="grey">
                <Icon name="asterisk"/>
              </Label>
          )
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
                   }}>{draggableLabel}{lastSavedMarkerPositionLabel}{cell.value}</div>
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
        <div className="wrapper">
          <Button onClick={this.props.startEditing}>Edit</Button>
          <Table celled selectable definition unstackable
                 style={{paddingLeft: "1em",
                 paddingRight: "1em"}}>
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
