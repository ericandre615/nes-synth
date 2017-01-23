import React from 'react';
import NoteList from './note-list.jsx';

import './note-attributes.less';

const NoteAttributes = React.createClass({
  onChange(e) {
    this.setState({
      selected: e.target.value
    });
  },

  componentWillMount() {
    this.state = {
      selected: 1
    }
  },

  assignNote(e) {
    e.preventDefault();
    const noteValue = e.target.dataset.note;
    const note = Object.assign({}, this.props.currentNote, {
      note: noteValue
    });

    this.props.setNoteData(note);
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
        <NoteList filter={ this.state.selected } onClick={ this.assignNote } />
      </div>
    );
  }
});

export default NoteAttributes;
