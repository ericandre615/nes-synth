import React from 'react';
import ReactDOM from 'react-dom';
import SynthEditor from './components/synth-editor';

const mountNode = document.getElementById('app');

ReactDOM.render(
  <SynthEditor />,
  mountNode
);
