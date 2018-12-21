import React, {Component} from 'react';

import './App.css';
import GridRow from '../components/GridRow/GridRow'

class KnitGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendlyId: props.friendlyId,
      name: '',
      grid: [],
      status: 'retrieving',
      message: 'Loading...'
    }
  }

  componentDidMount() {
    fetch(`/api/knitgrid?friendlyId=${this.state.friendlyId}`)
    .then(res => res.json())
    .then(response => {
      if (response.data.length > 0) {
        this.setState({
          name: response.data[0].name,
          grid: response.data[0].grid,
          status: 'retrieved',
          message: ''
        })
      } else {
        this.setState({
          name: 'no data returned',
          status: 'failure_retrieving',
          message: 'Failed to load data'
        })
      }
    })
    .catch(error => {
      this.setState(
          {
            status: 'failure_retrieving',
            message: `Failed to load data ${JSON.stringify(error)}`
          }
      )
    });
  }

  gridCellValueChangedHandler = (event, rowId, cellId) => {
    this.setState({
      grid: this.updateCell(rowId, cellId, {value: event.target.value})
    })
  };

  gridCellGotFocusHandler = (event, rowId, cellId) => {
    this.setState({
      grid: this.updateCell(rowId, cellId, {selected: true}, {selected: false})
    })
  };

  submitKnitDataHandler = (event) => {
    this.setState(
        {
          status: 'saving',
          message: 'Saving Data...'
        }
    )
    fetch('/api/knitgrid', {
      method: 'PUT',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      console.log('Success:', JSON.stringify(response))
      this.setState(
          {
            status: 'saved',
            message: ''
          }
      )
    })
    .catch(error => {
      console.error('Error:', error)
      this.setState(
          {
            status: 'save_error',
            message: 'Failed to save data'
          }
      )
    });
  };

  updateCell(rowId, cellId, targetCellUpdate, otherCellUpdate) {
    return this.state.grid.map((row) => {
      return {
        id: row.id,
        cells: row.cells.map((cell) => {
          let cellCopy = {
            id: cell.id,
            selected: cell.selected,
            value: cell.value
          }
          if (row.id === rowId && cell.id === cellId) {
            return {...cellCopy, ...targetCellUpdate}
          }
          if (otherCellUpdate) {
            return {...cellCopy, ...otherCellUpdate}
          }
          return cellCopy;
        })
      }
    });
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
    );

    let button = null;
    if (this.state.status !== "retrieving") {
      button = <button onClick={this.submitKnitDataHandler}
                       className="myButton">Save {this.state.name} Data
      </button>
    }

    return (
        <div className="App">
          <h1>{this.state.name}</h1>
          <h2>{this.state.message}</h2>
          {button}
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
