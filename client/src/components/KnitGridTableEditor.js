import React, {Component} from 'react';
import {Table, TextArea, Button, Image} from 'semantic-ui-react';
import _ from "lodash";
import uuidv4 from 'uuid/v4';

import insertColumnRight
  from '../assets/icons8-insert-column-right-filled-16.png';
import insertColumnLeft from '../assets/icons8-insert-column-left-16.png';
import insertRowAbove from '../assets/icons8-insert-row-above-16.png';
import insertRowBelow from '../assets/icons8-insert-row-16.png';
import deleteColumn from '../assets/icons8-delete-column-16.png';
import deleteRow from '../assets/icons8-delete-row-16.png';
import csv from '../assets/icons8-csv-16.png';

import PasteCsvModal from './modals/PasteCsvModal';


class KnitGridTableEditor extends Component {
  state = {
    currentCellId: null,
    currentCellValue: null,
    currentCellOriginalValue: null,
    pasteCsvModalVisible: false
  };

  cellValueChangedHandler = (event) => {
    if (event.target.id === this.state.currentCellId) {
      this.setState({
        currentCellValue: event.target.value
      })
    }
  };

  onFocusHandler = (event) => {
    console.log("onFocusHandler: " + event.target.id);
    this.setState({
      currentCellId: event.target.id,
      currentCellValue: event.target.value,
      originalCellValue: event.target.value
    })
  };

  onBlurHandler = (event) => {
    console.log("onBlurHandler: " + event.target.id);
    if (this.state.currentCellValue !== this.state.originalCellValue) {
      console.log("calling this.props.cellValueChanged");
      this.cellValueChanged(event.target.id, event.target.value);
    }
  };

  cellValueChanged = (cellId, cellValue) => {
    console.log("cellValueChanged: " + cellId + ", " + cellValue)
    let [i, j] = this.findCellLocation(cellId);
    if (i < 0 || j < 0) {
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    knitgrid.grid[i].cells[j].value = cellValue;
    console.log("Calling knitgridUpdated");
    this.props.knitgridUpdated(knitgrid);
  };

  insertColumnRight = () => {
    console.log("insertColumnRight: " + JSON.stringify(this.state));
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    for (let i = 0; i < knitgrid.grid.length; i++) {
      const row = knitgrid.grid[i];
      if (y < row.cells.length) {
        const newCell = {
          value: "",
          id: uuidv4(),
          selected: false
        };
        console.log("newCell: " + JSON.stringify(newCell));
        row.cells.splice(y + 1, 0, newCell);
      }
    }
    this.props.knitgridUpdated(knitgrid);
  };

  insertColumnLeft = () => {
    console.log("insertColumnLeft: " + JSON.stringify(this.state));
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    for (let i = 0; i < knitgrid.grid.length; i++) {
      const row = knitgrid.grid[i];
      const newCell = {
        value: "",
        id: uuidv4(),
        selected: false
      };
      console.log("newCell: " + JSON.stringify(newCell));
      row.cells.splice(y, 0, newCell);
    }
    this.props.knitgridUpdated(knitgrid);
  };

  insertRowBelow = () => {
    console.log("insertRowBelow");
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    const newRow = this.createNewRow(knitgrid.grid[x].cells.length);
    knitgrid.grid.splice(x + 1, 0, newRow);
    this.props.knitgridUpdated(knitgrid);
  };

  insertRowAbove = () => {
    console.log("insertRowAbove");
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    const newRow = this.createNewRow(knitgrid.grid[x].cells.length);
    knitgrid.grid.splice(x, 0, newRow);
    this.props.knitgridUpdated(knitgrid);
  };

  deleteColumn = () => {
    console.log("deleteColumn");
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    for (let i = 0; i < knitgrid.grid.length; i++) {
      const row = knitgrid.grid[i];
      if (row.cells.length <= 1) {
        continue;
      }
      if (y < row.cells.length) {
        row.cells.splice(y, 1);
      }
    }
    this.props.knitgridUpdated(knitgrid);
  };

  deleteRow = () => {
    console.log("deleteRow");
    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);
    if (knitgrid.grid.length <= 1) {
      return;
    }
    knitgrid.grid.splice(x, 1);
    this.props.knitgridUpdated(knitgrid);
  };

  pasteCsvModalClosed = (choice, csv) => {
    console.log("pasteCsvModalClosed, choice: " + choice);
    if (choice !== "ok") {
      this.setState({
        pasteCsvModalVisible: false
      })
      return;
    }

    let [x, y] = this.findCellLocation(this.state.currentCellId);
    console.log("x, y: " + x + ", " + y);
    if (x < 0 || y < 0) {
      console.log("returning");
      return;
    }
    const knitgrid = _.cloneDeep(this.props.knitgrid);

    this.pasteCsv(knitgrid, csv, x, y);

    this.props.knitgridUpdated(knitgrid);

    this.setState({
      currentCellId: knitgrid.grid[x].cells[y].id,
      currentCellValue: knitgrid.grid[x].cells[y].value,
      pasteCsvModalVisible: false
    });

  };

  csvToKnitInstructions = (csv) => {
    const knitInstructions = [];
    if (!csv) {
      return knitInstructions;
    }

    let inBrackets = false;
    let currentInstruction = "";

    for (let i = 0; i < csv.length; i++) {
      const c = csv.charAt(i);
      if (!inBrackets) {
        if (c === ',') {
          knitInstructions.push(currentInstruction.trim());
          currentInstruction = "";
        } else if (c === '[') {
          currentInstruction += c;
          inBrackets = true;
        } else {
          currentInstruction += c;
        }
      } else {
        if (c === ']') {
          currentInstruction += c;
          inBrackets = false;
        } else {
          currentInstruction += c;
        }
      }
    }
    knitInstructions.push(currentInstruction.trim());
    return knitInstructions;
  };

  pasteCsv = (knitgrid, csv, x, y) => {
    const knitInstructions = this.csvToKnitInstructions(csv);
    if (knitInstructions === null || knitInstructions.length === 0) {
      return;
    }
    const pasteTargetCells = knitgrid.grid[x].cells;
    for (let k = 0; k < knitInstructions.length; k++) {
      const value = knitInstructions[k];
      const cellIndex = k + y;
      if (cellIndex >= pasteTargetCells.length) {
        const cell = {
          id: uuidv4(),
          value: value,
          selected: false
        };
        pasteTargetCells.push(cell);
      } else {
        pasteTargetCells[cellIndex].value = value;
      }
    }
  };

  pasteCsvModalHandler = () => {
    this.setState({
      pasteCsvModalVisible: true
    })
  };


  createNewRow = (numCells) => {
    const newCells = [];
    for (let i = 0; i < numCells; i++) {
      const newCell = {
        value: "",
        id: uuidv4(),
        selected: false
      };
      newCells.push(newCell);
    }
    const newRow = {
      id: uuidv4(),
      cells: newCells
    };
    return newRow;
  };

  findCellLocation = (cellId) => {
    for (let i = 0; i < this.props.knitgrid.grid.length; i++) {
      const row = this.props.knitgrid.grid[i];
      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];
        if (cell.id === cellId) {
          return [i, j];
        }
      }
    }
    return [-1, -1];
  };

  rowCells = (row) => {
    return row.cells.map(cell => {
      let value = cell.value;
      if (cell.id === this.state.currentCellId) {
        value = this.state.currentCellValue;
      }
      return (
          <Table.Cell selectable
                      key={cell.id}
                      style={{height: "1px"}}>

                <TextArea
                    rows={3}
                    style={{
                      maxWidth: "75px"
                    }}
                    id={cell.id}
                    value={value}
                    onFocus={event => this.onFocusHandler(event)}
                    onBlur={event => this.onBlurHandler(event)}
                    onChange={event => this.cellValueChangedHandler(event)}
                />

          </Table.Cell>
      )
    })
  };

  getMaxColumnsInRow = () => {
    let maxColumns = 0;
    for (let i = 0; i < this.props.knitgrid.grid.length; i++) {
      const numColumns = this.props.knitgrid.grid[i].cells.length;
      if (numColumns > maxColumns) {
        maxColumns = numColumns;
      }
    }
    return maxColumns;
  };

  render() {
    console.log("[KnitGridTableEditor]: render");
    const tableRows = this.props.knitgrid.grid.map((row, i) => {
      return (
          <Table.Row key={row.id}>
            <Table.Cell singleLine={true} key={"Row" + (i + 1)}>
              {"Row " + (i + 1)}
            </Table.Cell>
            {this.rowCells(row)}
          </Table.Row>
      )
    });

    const headerCells = [(<Table.HeaderCell key={0}
                                            style={{
                                              backgroundColor: "rgb(249, 250, 251)",
                                              borderBottom: "1px solid black"
                                            }}/>)];
    const maxColumnsInRow = this.getMaxColumnsInRow();

    for (let i = 0; i < maxColumnsInRow; i++) {
      headerCells.push((<Table.HeaderCell key={i + 1}>{"Column " + (i
          + 1)}</Table.HeaderCell>))
    }

    return (
        <div>
          <div style={{paddingBottom: "10px"}}>
            <Button onClick={this.props.doneEditing}>
              Done Editing
            </Button>

          </div>
          <div style={{paddingBottom: "10px"}}>
            <Button title="Insert column left"
                    onClick={this.insertColumnLeft}><Image
                src={insertColumnLeft}/></Button>
            <Button title="Insert column right"
                    onClick={this.insertColumnRight}><Image
                src={insertColumnRight}/></Button>
            <div className="divider"/>
            <Button title="Insert row below"
            onClick={this.insertRowBelow}><Image
                src={insertRowBelow}/></Button>
            <Button title="Insert row above"
                    onClick={this.insertRowAbove}><Image
                src={insertRowAbove}/></Button>
            <div className="divider"/>
            <div className="divider"/>
            <Button title="Delete column" onClick={this.deleteColumn}><Image src={deleteColumn}/></Button>
            <Button title="Delete row" onClick={this.deleteRow}><Image src={deleteRow}/></Button>
            <div className="divider"/>
            <div className="divider"/>
            <Button title="Paste CSV"
                    onClick={this.pasteCsvModalHandler}>
              <Image src={csv}/>
            </Button>
          </div>
          <div className="wrapperEditor">

            <Table celled selectable definition unstackable
                   style={{
                     paddingLeft: "1em",
                     paddingRight: "1em"
                   }}>
              <Table.Header>
                <Table.Row>
                  {headerCells}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableRows}
              </Table.Body>
              <Table.Footer>

              </Table.Footer>
            </Table>
          </div>
          <PasteCsvModal visible={this.state.pasteCsvModalVisible}
                            closeAction={this.pasteCsvModalClosed}/>
        </div>
    )
  }
}

export default KnitGridTableEditor;
