import React from 'react';
import { connect } from 'react-redux';
import { setNoteData, initAudioContext, updateNoteTime, setPlayStatus, setTimeoutId } from '../../actions/synth-actions'; 
import { initSynthContext, scheduler, play } from '../../lib/synth-functions';

import './seq.less';

const bar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const cell = bar.slice();


let clockWorker = null;

const Seq = React.createClass({
  clockData: {
    isPlaying: false, // initialize to false
    nextNoteTime: 0.0, // when the next note is due
    startTime: 0, // start time of sequence
    beatIndex: 0, // which beat are we currently on
    currentNote: 0, // note that is currently last scheduled
    lookAhead: 25.0, // How frequently to call schedule (in milliseconds)
    scheduleAheadTime: 0.1, // How far to schedule audio (sec) calculated from lookAhead
  },

  clickHandler(e) {
    const cell = e.target;

    e.preventDefault();

    cell.classList.toggle('on');
    let noteFreq = 0;

    switch(cell.dataset.chan) {
      case 'sq1':
        noteFreq = 440;
      case 'sq2':
        noteFreq = 220;
      case 'tri':
        noteFreq = 320;
      case 'nos':
        noteFreq = 100;
      default:
        noteFreq = 0;
    };

    this.props.setNoteData({
      bar: 0,
      beat: parseInt(cell.dataset.beat, 10),
      note: noteFreq,
      gain: (cell.classList.contains('on')) ? 1 : 0,
      filter: null,
      length: 0.05,
      chan: cell.dataset.chan
    });
  },

  playHandler(e) {
    e.preventDefault();
    console.log('pressed play');
    this.props.setTimeoutId(play(this.props.synth, this.clockData, clockWorker, this.props.setPlayStatus));
  },

  componentWillMount() {
    if(!this.props.synth.initialized) {
      const synthContext = initSynthContext();
      console.log('SynthContext: ', synthContext);
      this.props.initAudioContext(synthContext);
    }
  },

  componentDidMount() {
    clockWorker = new Worker('workers/synth-worker.js');

    clockWorker.onmessage = (e) => {
      if(e.data == 'tick') {
        scheduler(this.props.synth, this.clockData);
      }
    };

    clockWorker.postMessage({
      'interval': this.props.synth.lookAhead
    });
  },

  render() {
    const bars = bar.map(item => {
      return (
        <th key={ `bar-${item}` } scope="col">{ item + 1 }</th>
      );
    });

    const sq1Cells = cell.map(item => {
      return (
        <td
          key={ `sq1-${item}` }
          className={ `col-${item} sq1` }
          data-chan="sq1"
          data-beat={ item + 1 }
          onClick={ this.clickHandler }
        />
      );
    });

    const sq2Cells = cell.map(item => {
      return (
        <td
          key={ `sq2-${item}` }
          className={ `col-${item} sq2` }
          data-chan="sq2"
          data-beat={ item + 1 }
          onClick={ this.clickHandler }
        />
      );
    });

    const triCells = cell.map(item => {
      return (
        <td
          key={ `tri-${item}` }
          className={ `col-${item} tri` }
          data-chan="tri"
          data-beat={ item + 1 }
          onClick={ this.clickHandler }
        />
      );
    });

    const nosCells = cell.map(item => {
      return (
        <td
          key={ `nos-${item}` }
          className={ `col-${item} nos` }
          data-chan="nos"
          data-beat={ item + 1 }
          onClick={ this.clickHandler }
        />
      );
    });

    return (
      <div id="temp">
        <button id="play" className="transport" onClick={ this.playHandler }>Play</button>
      <table id="sequencer">
        <colgroup span="17"></colgroup>
        <thead>
          <tr id="seq-header">
            <th scope="col"> Chan </th>
            { bars }
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Sq1</th>
            { sq1Cells }
          </tr>
          <tr>
            <th scope="row">sq2</th>
            { sq2Cells }
          </tr>
          <tr>
            <th scope="row">Tri</th>
            { triCells }
          </tr>
          <tr>
            <th scope="row">Nos</th>
            { nosCells }
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
        </div>
    );
  }
});

const mapStateToProps = (state) => {
  return {
    synth: state.synth,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNoteData: note => dispatch(setNoteData(note)),
    initAudioContext: synth => dispatch(initAudioContext(synth)),
    updateNoteTime: nextNote => dispatch(updateNoteTime(nextNote)),
    setPlayStatus: isPlaying => dispatch(setPlayStatus(isPlaying)),
    setTimeoutId: timeoutId => dispatch(setTimeoutId(timeoutId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Seq);
