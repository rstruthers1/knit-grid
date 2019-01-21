import React, {Component} from 'react';
import './App.css';
import GridRow from '../components/GridRow/GridRow'

class KnitGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      friendlyId: props.friendlyId,
      id: props.id,
      name: '',
      grid: [],
      status: 'retrieving',
      message: 'Loading...',
      changeSaved: true,
      selectedCellId: null
    }
  }

  componentDidMount() {
    fetch(`/api/knitgrid/${this.state.id}`)
    .then(res => res.json())
    .then(response => {
      if (response.data) {

        this.setState({
          name: response.data.name,
          grid: response.data.grid,
          status: 'retrieved',
          message: '',
          selectedCellId: this.getSelectedCellId(response.data.grid)
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
            message: 'Failed to load data '
          }
      )
    });
  }

  gridCellValueChangedHandler = (event, rowId, cellId) => {
    this.setState({
      grid: this.copyGridWithModifiedCellAdded(rowId, cellId,
          {value: event.target.value}),
      changeSaved: false
    })
  };

  gridCellGotFocusHandler = (event, rowId, cellId) => {
    const selectedCellId = this.state.selectedCellId
    this.setState({
      grid: this.copyGridWithModifiedCellAdded(rowId, cellId, {selected: true},
          {selected: false}),
      changeSaved: cellId === selectedCellId,
      selectedCellId: cellId
    })
  };

  submitKnitDataHandler = (event) => {
    this.setState(
        {
          status: 'saving',
          message: ''
        }
    );
    fetch('/api/knitgrid', {
      method: 'PUT',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(response => {
      this.setState(
          {
            status: 'saved',
            message: '',
            changeSaved: true
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

  copyGridWithModifiedCellAdded = (rowId, cellId, targetCellUpdate,
      otherCellUpdate) => {
    return this.state.grid.map((row) => {
      return {
        id: row.id,
        cells: row.cells.map((cell) => {
          if (row.id === rowId && cell.id === cellId) {
            return {...cell, ...targetCellUpdate}
          }
          if (otherCellUpdate) {
            return {...cell, ...otherCellUpdate}
          }
          return {...cell};
        })
      }
    })
  }

  getSelectedCellId(grid) {
    let selectedCellId = null
    grid.forEach(row => {
      row.cells.forEach(cell => {
            if (cell.selected) {
              selectedCellId =  cell.id
              return
            }
          }
      )
      if (selectedCellId) {
        return
      }
    })
    return selectedCellId
  }

  saveButtonDisabled = () => {
    return this.state.changeSaved || this.state.status === 'saving'
  };

  buttonText = () => {
    if (this.state.changeSaved) {
      if (this.state.status === 'retrieving') {
        return 'Loading data...'
      }
      if (this.state.status === 'failure_retrieving') {
        return 'Failed to Load Data'
      }
      return `${this.state.name} Data Saved`
    } else {
      if (this.state.status === 'saving') {
        return `Saving ${this.state.name} Data`
      }
      return `Save ${this.state.name} Data`
    }
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

    return (
        <div className="App">
          <h1>{this.state.name}</h1>
          <h2>{this.state.message}</h2>
          <button onClick={this.submitKnitDataHandler}
                  className="myButton"
                  disabled={this.saveButtonDisabled()}>{this.buttonText()}</button>
          <table style={{height:'500px', width: '700px'}}>
            <tbody>
            {grid}
            </tbody>
          </table>
          <hr/>
        </div>
    );
  }

}

export default KnitGrid;
