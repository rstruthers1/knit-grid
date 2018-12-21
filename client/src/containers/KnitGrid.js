import React, {Component} from 'react';

import './App.css';
import GridRow from '../components/GridRow/GridRow'

class KnitGrid extends Component {
  constructor(props) {
    super(props)

    this.state = {
      friendlyId: props.friendlyId,
      name: "Loading...",
      grid: []
    }
  }

  componentDidMount() {
    console.log('component did mount');
    fetch(`/api/knitgrid?friendlyId=${this.state.friendlyId}`)
    .then(res => res.json())
    .then(response => {
      console.log('**** Success - got data:', JSON.stringify(response))
      if (response.data.length > 0) {
        this.setState({
          name: response.data[0].name,
          grid: response.data[0].grid
        })
      } else {
        this.setState({
          name: "no data returned"
        })
      }
    })
    .catch(error => console.error('**** Error:', error));
  }


  gridCellValueChangedHandler = (event, rowId, cellId) => {
    let newRows = this.state.grid.map((row) => {
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
      grid: newRows
    })
  }

  gridCellGotFocusHandler = (event, rowId, cellId) => {
    let newRows = this.state.grid.map((row) => {
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
      grid: newRows
    })
  }

  submitKnitDataHandler = (event) => {
    console.log(`Save ${this.state.name} data`)
    console.log("data: " + JSON.stringify(this.state))

    fetch('/api/knitgrid', {
      method: 'PUT',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

  render() {
    let grid = this.state.grid.map((row) => {
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
                  className="myButton">Save {this.state.name} Data
          </button>
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
