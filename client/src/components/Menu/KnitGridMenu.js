import React, {Component} from 'react'
import {Dropdown, Menu} from 'semantic-ui-react'

import logo from '../../assets/knitting-needles.svg'

export default class KnitGridMenu extends Component {


  render() {
    let homeMenuStyle = {
      width: '150px'
    }

    return (
        <Menu>

          <Menu.Item style={homeMenuStyle}>
            <img src={logo} className="App-logo" alt="logo" width="40px"
                 height="40px"/> KnitGrid

          </Menu.Item>

          <Dropdown item text='Project'>
            <Dropdown.Menu >
              <Dropdown.Item text='New Project...'
                             onClick={() => this.props.clicked('NEW_PROJECT')}
                             />
              <Dropdown.Item text='Open Project...'
                             onClick={() => this.props.clicked('OPEN_PROJECT')}
                             />
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text='File'>
            <Dropdown.Menu>
              <Dropdown.Item text='New File...'/>
              <Dropdown.Item text='Open File...'/>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
    )
  }

}
