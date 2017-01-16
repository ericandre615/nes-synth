import React from 'react';
import Seq from './seq.jsx';

const SynthEditor = React.createClass({
  render() {
    return (
      <section id="synth-editor">
        <Seq />
      </section>
    );
  }
});

export default SynthEditor;
