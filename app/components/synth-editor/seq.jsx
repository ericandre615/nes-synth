import React from 'react';
import { connect } from 'react-redux';
import { setNoteData, initAudioContext, updateNoteTime, setPlayStatus, setTimeoutId } from '../../actions/synth-actions';
import { initSynthContext, scheduler, play, stop, resetPlayHead, drawStep } from '../../lib/synth-functions';
import TransportButtons from './transport-buttons.jsx';

import './seq.less';

const bar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const cell = bar.slice();

const clockData = {
  isPlaying: false, // initialize to false
  nextNoteTime: 0.0, // when the next note is due
  startTime: 0, // start time of sequence
  beatIndex: 0, // which beat are we currently on
  currentNote: 0, // note that is currently last scheduled
  lookAhead: 25.0, // How frequently to call schedule (in milliseconds)
  scheduleAheadTime: 0.1, // How far to schedule audio (sec) calculated from lookAhead
};


let clockWorker = null;

const Seq = React.createClass({

  clickColumnHandler(e) {
    const col = e.target;
    const resetPosition = parseInt(col.innerHTML, 10) || 0;

    console.log('reset ', resetPosition);
    console.log(e.target.innerHTML);

    resetPlayHead(resetPosition, clockData)
  },

  clickHandler(e) {
    const cell = e.target;

    e.preventDefault();

    cell.classList.toggle('on');
    let noteFreq = 0;

    switch(cell.dataset.chan) {
      case 'sq1':
        noteFreq = 440;
        break;
      case 'sq2':
        noteFreq = 220;
        break;
      case 'tri':
        noteFreq = 320;
        break;
      case 'nos':
        noteFreq = 100;
        break;
      default:
        noteFreq = 0;
    };

    if(!cell.classList.contains('on')) {
      // note off
      noteFreq = 0;
    }

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

    const btn = e.target;

    if(btn.classList.toggle('active')) {
      btn.classList.remove('icon-play');
      btn.classList.add('icon-pause');
    } else {
      btn.classList.remove('icon-pause');
      btn.classList.add('icon-play');
    };

    this.props.setTimeoutId(play(this.props.synth, clockData, clockWorker, this.props.setPlayStatus, drawStep));
  },

  stopHandler(e) {
    e.preventDefault();
    if(this.props.synth.isPlaying) {
      this.props.setTimeoutId(stop(this.props.synth, clockData, clockWorker, this.props.setPlayStatus, drawStep));
    }
  },

  componentWillMount() {
    if(!this.props.synth.initialized) {
      const synthContext = initSynthContext();

      this.props.initAudioContext(synthContext);
    }
  },

  componentDidMount() {
    clockWorker = new Worker('workers/synth-worker.js');

    clockWorker.onmessage = (e) => {
      if(e.data == 'tick') {
        scheduler(this.props.synth, clockData);
      }
    };

    clockWorker.postMessage({
      'interval': clockData.lookAhead
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
        <TransportButtons
          playHandler={ this.playHandler }
          stopHandler={ this.stopHandler }
        />
      <table id="sequencer">
        <colgroup span="17"></colgroup>
        <thead>
          <tr id="seq-header" onClick={ this.clickColumnHandler }>
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
