import React, {Component} from 'react';
import './App.css';
import KnitGrid from './KnitGrid'

class KnitGridGroup extends Component {
  render() {
    return (
        <div>
          <KnitGrid friendlyId="rachel.chimneyfire.lower_body"/>
          <KnitGrid friendlyId="rachel.chimneyfire.left_side_cable_pattern"/>
          <KnitGrid friendlyId="rachel.chimneyfire.right_side_cable_pattern"/>
        </div>
    )
  }
}

export default KnitGridGroup
