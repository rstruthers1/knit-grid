import React, {Component} from 'react';

import './App.css';
import GridRow from '../components/GridRow/GridRow'

import uuidv4 from 'uuid/v4';


class KnitGrid extends Component {
  constructor(props) {
    super(props)
    if (props.knitData) {
      this.state = {
        name: props.name ? props.name : "Knit Grid",
        grid: {
          rows: this.parseData(props.knitData)
        }
      }
    }
  }

  state = {
    grid: {
      name: "Knit Grid",
      id: uuidv4(),
      rows: [
        {
          id: uuidv4(),
          cells: [{value: '', id: uuidv4(), selected: false},
          ]
        }
      ]
    }
  }

  parseData = (rawData) => {
    let lines = rawData.split(/\r?\n/g)
    return lines.map((line) => {
      let rowCellValues = line.split('\t')
      return {
        id: uuidv4(),
        cells: rowCellValues.map((cellValue) => {
          return {
            id: uuidv4(),
            value: cellValue,
            selected: false
          }
        })
      }
    })
  }


  gridCellValueChangedHandler = (event, rowId, cellId) => {
    let newRows = this.state.grid.rows.map((row) => {
      return {
        id: row.id,
        cells: row.cells.map((cell) => {
          return {
            id: cell.id,
            selected: cell.selected,
            value: (row.id === rowId && cell.id === cellId) ? event.target.value
                : cell.value
          }
        })
      }
    })

    this.setState({
      grid: {
        rows: newRows
      }
    })
  }

  gridCellGotFocusHandler = (event, rowId, cellId) => {
    let newRows = this.state.grid.rows.map((row) => {
      return {
        id: row.id,
        cells: row.cells.map((cell) => {
          return {
            id: cell.id,
            selected: (row.id === rowId) && (cell.id === cellId),
            value: cell.value
          }
        })
      }
    })

    this.setState({
      grid: {
        rows: newRows
      }
    })
  }

  submitKnitDataHandler = (event) => {
    console.log(`Save ${this.state.name} data`)
    console.log("data: " + JSON.stringify(this.state))

    fetch('/api/saveKnitData', {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(this.state), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

  render() {

    let grid = this.state.grid.rows.map((row) => {
          return (
              <GridRow row={row}
                       changed={this.gridCellValueChangedHandler}
                       onfocus={this.gridCellGotFocusHandler}
                       key={row.id}/>
          )
        }
    )

    return (
        <div className="App">
          <h1>{this.state.name}</h1>

          <button onClick={this.submitKnitDataHandler}
                  className="myButton">Save {this.state.name} Data</button>

          <table>
            <tbody>
            {grid}
            </tbody>
          </table>
        </div>
    );
  }
}

export default KnitGrid;
