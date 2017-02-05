import React from 'react';
import NoteList from './note-list.jsx';
import Note from './note.jsx';

import './note-attributes.less';

const NoteAttributes = React.createClass({
  onOctiveChange(e) {
    this.setState({
      selected: e.target.value
    });
  },

  onGainChange(e) {
    e.preventDefault();
    const gainValue = parseFloat(e.target.value, 10);
    const note = Object.assign({}, this.props.currentNote, {
      gain: gainValue
    });

    this.props.setNoteData(note);
    this.setState({ currentGain: gainValue });
  },

  componentWillMount() {
    this.state = {
      selected: 1,
      currentGain: this.props.currentNote.gain
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

  componentWillReceiveProps(nextProps) {
    console.log('ATTRIB ', nextProps);
  },

  render() {
    const octives = new Array(9).fill(0).map((octive, idx) => {
      return (
        <option key={ idx } value={ idx }>{ idx }</option>
      );
    });

    return (
      <div id="note-attributes">
        <select id="octive-select" value={ this.state.selected } onChange={ this.onOctiveChange }>
          { octives }
        </select>
        <NoteList filter={ this.state.selected } onClick={ this.assignNote } />
        <label>Volume</label>
        <input type="range" value={ this.state.currentGain }  min="0.0" max="1.0" step="0.05" onChange={ this.onGainChange } />
        <Note note={ this.props.currentNote } />
      </div>
    );
  }
});

export default NoteAttributes;
