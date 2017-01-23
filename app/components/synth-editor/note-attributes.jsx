import React from 'react';
import NoteList from './note-list.jsx';

import './note-attributes.less';

const NoteAttributes = React.createClass({
  onChange(e) {
    console.log('filtering ', e.target.value);
    this.setState({
      selected: e.target.value
    });
  },

  componentWillMount() {
    this.state = {
      selected: 1
    }
  },

  render() {
    const octives = new Array(9).fill(0).map((octive, idx) => {
      return (
        <option key={ idx } value={ idx }>{ idx }</option>
      );
    });

    return (
      <div id="note-attributes">
        <select id="octive-select" value={ this.state.selected } onChange={ this.onChange }>
          { octives }
        </select>
        <NoteList filter={ this.state.selected } />
      </div>
    );
  }
});

export default NoteAttributes;
