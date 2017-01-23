import React from 'react';
import noteMap from '../../lib/notes';

import './note-list.less';

const NoteList = React.createClass({
  getDefaultProps() {
    return {
      notes: noteMap,
      filter: 0
    };
  },

  render() {
    const notes = Object.keys(this.props.notes).map(note => {
      const octive = note.match(/\d/);
      if(this.props.filter == octive) {
        return (
          <li
            key={ note }
            className="note"
            data-note={ note }
            data-freq={ this.props.notes[note].freq }
            data-hex={ this.props.notes[note].hex }
            onClick={ this.props.onClick }
          >
              { note }
          </li>
        );
      }
    });

    return (
      <ul id="note-list">
        { notes }
      </ul>
    );
  }
});

export default NoteList;
