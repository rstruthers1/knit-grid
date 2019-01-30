import React, {Component} from 'react';
import {Dropdown, Menu} from 'semantic-ui-react';

import logo from '../../assets/knitting-needles.svg';
import {MenuItemIds} from '../../constants/Constants';

export default class KnitGridMenu extends Component {

  render() {
    let homeMenuStyle = {
      width: '150px'
    }

    return (
        <Menu className="top fixed">

          <Menu.Item style={homeMenuStyle}>
            <img src={logo} className="App-logo" alt="logo" width="40px"
                 height="40px"/> KnitGrid

          </Menu.Item>

          <Dropdown item text='Project'>
            <Dropdown.Menu >
              <Dropdown.Item text='New Project...'
                             onClick={() => this.props.clicked(MenuItemIds.NEW_PROJECT)}
                             />
              <Dropdown.Item text='Open Project...'
                             onClick={() => this.props.clicked(MenuItemIds.OPEN_PROJECT)}
                             />
              <Dropdown.Item text='Save Project'
                             onClick={() => this.props.clicked(MenuItemIds.SAVE_PROJECT)}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
    )
  }

}
