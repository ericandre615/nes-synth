import React from 'react';
import { connect } from 'react-redux';
import { setNoteData } from '../../actions/synth-actions'; 

import './seq.less';

const bar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const cell = bar.slice();

const Seq = React.createClass({
  clickHandler(e) {
    const cell = e.target;

    e.preventDefault();

    cell.classList.toggle('on');

    this.props.setNoteData({
      bar: 1,
      beat: parseInt(cell.dataset.beat, 10),
      note: 'A2',
      gain: 1,
      filter: null,
      length: 1,
      chan: cell.dataset.chan
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Seq);
