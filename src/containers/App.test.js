import React from 'react';
import ReactDOM from 'react-dom';
import KnitGrid from './KnitGrid';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<KnitGrid />, div);
  ReactDOM.unmountComponentAtNode(div);
});
