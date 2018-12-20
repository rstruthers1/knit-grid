import React, {Component} from 'react';

import './App.css';
import GridRow from '../components/GridRow/GridRow'

import uuidv4 from 'uuid/v4';

const initialRowUuid = uuidv4();
const initialCellUuid = uuidv4();
let knitData = `sl1wyf	k1	left side cable pattern	[k1, p1] to 7sts before m	[k2, p2] 3 times	k2	p1	[k1, p1] to 7sts before m	[k2, p2] 3 times	k2	[p1, k1] to cable pattern	right side cable pattern	s1wyf	k1
sl1wyf	k1	right side cable pattern	kp	left side cable pattern	sl1wyf	k1
sl1wyf	k1	left side cable pattern	k2	[p1, k1] to 7 sts before m	[k2, p2] 3 times	k2	k1	[p1, k1] to 7 sts before m	[k2, p2] 3 times	k2	[k1, p1] to 2 sts before cable pattern	k2	right side cable pattern	sl1wyf	k1
sl1wyf	k1	right side cable pattern	kp	left side cable pattern	sl1wyf	k1`

class App extends Component {

  state = {
    grid: {
      name: "Knit Grid",
      rows: [
        {
          id: initialRowUuid,
          cells: [{value: '', id: initialCellUuid},
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
            value: cellValue
          }
        })
      }
    })
  }

  componentDidMount() {
    this.setState({
      grid: {
        rows: this.parseData(knitData)
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

  render() {

    let grid = this.state.grid.rows.map((row) => {
          return (
              <GridRow row={row} changed={this.gridCellValueChangedHandler}
                       key={row.id}/>
          )
        }
    )

    return (
        <div className="App">
          <h1>Knit Grid</h1>
          <table>
            <tbody>
            {grid}
            </tbody>
          </table>
        </div>
    );
  }
}

export default App;
