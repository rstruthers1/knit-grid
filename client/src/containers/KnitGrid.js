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
    console.log('component did mount');
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
          message: 'failed to load data'
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
    });

    this.setState({
      grid: newRows
    })
  };

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
    });

    this.setState({
      grid: newRows
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
    if (this.state.status != "retrieving") {
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
