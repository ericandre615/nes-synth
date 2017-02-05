import React from 'react';

const Note = React.createClass({
  propTypes: {
    note: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      note: {
        bar: null,
        chan: null,
        note: null,
        gain: null,
        filter: null,
        length: null,
        beat: null
      }
    };
  },

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.note);
  },

  render() {
    return (
      <div id="selected-note">
        <ul>
          <li>Bar: { this.props.note.bar } - { this.props.note.beat + 1 }</li>
          <li>Channel: { this.props.note.chan }</li>
          <li>Note: { this.props.note.note }</li>
          <li>Gain: { this.props.note.gain }</li>
          <li>Filter: { this.props.note.filter }</li>
          <li>Length: { this.props.note.length }</li>
        </ul>
      </div>
    );
  }
});

export default Note;
