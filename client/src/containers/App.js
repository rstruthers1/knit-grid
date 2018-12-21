import React, {Component} from 'react';

import './App.css';

import KnitGrid from './KnitGrid'

/**
let lowerBodyData = `sl1wyf	k1	left side cable pattern	[k1, p1] to 7sts before m	[k2, p2] 3 times	k2	p1	[k1, p1] to 7sts before m	[k2, p2] 3 times	k2	[p1, k1] to cable pattern	right side cable pattern	s1wyf	k1
sl1wyf	k1	right side cable pattern	kp	left side cable pattern	sl1wyf	k1
sl1wyf	k1	left side cable pattern	k2	[p1, k1] to 7 sts before m	[k2, p2] 3 times	k2	k1	[p1, k1] to 7 sts before m	[k2, p2] 3 times	k2	[k1, p1] to 2 sts before cable pattern	k2	right side cable pattern	sl1wyf	k1
sl1wyf	k1	right side cable pattern	kp	left side cable pattern	sl1wyf	k1`

let leftSideCablePatternData = `k1	p2	k3	p4	k6	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	k3	p4	slip 3 sts to a cable needle held at back of work, k3, k3 from cable needle	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	k3	p4	k6	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	p2	k6	p2	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle	p2	k1
p1	k4	p3	k2	p6	k2	p3	k4	p1
k1	p4		slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	slip 3 sts to a cable needle held at back of work, k3, k3 from cable needle	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle		p4	k1
p1	k6		p12			k6		p1
k1	p6		slip 3 sts to a cable needle held at front of work, k3, k3 from cable needle		slip 3 sts to a cable needle held at front of work, k3, k3 from cable needle	p6		k1
p1	k6		p12			k6		p1
k1	p4	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle		slip 3 sts to a cable needle held at back of work, k3, k3 from cable needle		slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	p4	k1
p1	k4	p3	k2	p6	k2	p3	k4	p1
k1	p2	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle	p2	k6	p2	slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1`

let rightSideCablePatternData = `k1	p2	k3	p4	k6	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	k3	p4	slip 3 sts to a cable needle held at front of work, k3, k3 from cable needle	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	k3	p4	k6	p4	k3	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1
k1	p2	slip 3 sts to cable needle held at front of work, p2, k3 from cable needle	p2	k6	p2	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle	p2	k1
p1	k4	p3	k2	p6	k2	p3	k4	p1
k1	p4		slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	slip 3 sts to a cable needle held at front of work, k3, k3 from cable needle	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle		p4	k1
p1	k6		p12			k6		p1
k1	p6		slip 3 sts to a cable needle held at back of work, k3, k3 from cable needle		slip 3 sts to a cable needle held at back of work, k3, k3 from cable needle	p6		k1
p1	k6		p12			k6		p1
k1	p4	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle		slip 3 sts to a cable needle held at front of work, k3, k3 from cable needle		slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	p4	k1
p1	k4	p3	k2	p6	k2	p3	k4	p1
k1	p2	slip 2 sts to a cable needle held at back of work, k3, p2 from cable needle	p2	k6	p2	slip 3 sts to a cable needle held at front of work, p2, k3 from cable needle	p2	k1
p1	k2	p3	k4	p6	k4	p3	k2	p1`
 **/

class App extends Component {
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

export default App
