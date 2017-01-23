import { SET_NOTE_DATA, SET_CURRENT_NOTE, INIT_AUDIO_CONTEXT, UPDATE_NOTE_TIME, SET_PLAY_STATUS, SET_TIMEOUT_ID } from '../actions/action-types';
import { synthActions } from '../actions';
import { createNewBar } from '../lib/synth-functions';

const initNotesPerBar = 16;

const noteModel = {
  bar: 0,
  beat: 0,
  note: 'rest',
  gain: 0,
  filter: null,
  length: 0.05,
  chan: 'sq1'
};

const initialState = { // synth
  context: null, // web AudioContext
  masterGain: null,
  notesPerBar: initNotesPerBar,
  isPlaying: false,
  loop: 1, // number of bars in loop
  nextNoteTime: 0.0, // when the next note is due
  startTime: 0, // start time of sequence
  beatIndex: 0, // which beat are we currently on
  timeoutId: 0, // id for requestAnimationFrame
  tempo: 120.0,
  tempo_max: 240.0,
  tempo_min: 40.0,
  tempo_step: 4,
  currentNote: 0, // note that is currently last scheduled
  lookAhead: 25.0, // How frequently to call schedule (in milliseconds)
  scheduleAheadTime: 0.1, // How far to schedule audio (sec) calculated from lookAhead
  currentNote: {},
  bars: [{
    sq1: createNewBar(initNotesPerBar, Object.assign({}, noteModel, { chan: 'sq1' })),
    sq2: createNewBar(initNotesPerBar, Object.assign({}, noteModel, { chan: 'sq2' })),
    tri: createNewBar(initNotesPerBar, Object.assign({}, noteModel, { chan: 'tri' })),
    nos: createNewBar(initNotesPerBar, Object.assign({}, noteModel, { chan: 'nos' }))
  }],
  initialized: false
}

const synthReducers = (state = initialState, action) => {
  switch (action.type) {
    case INIT_AUDIO_CONTEXT:
      if(state.initialized) {
        return state;
      }

      return Object.assign({}, state, {
        context: action.context,
        masterGain: action.masterGain,
        initialized: true
      });
    case SET_NOTE_DATA:
      const newBars = state.bars.slice();

      newBars[action.note.bar][action.note.chan][action.note.beat] = action.note

      return Object.assign({}, state, {
        bars: newBars
      });
    case SET_CURRENT_NOTE:
      return Object.assign({}, state, {
        currentNote: action.note
      });
    case UPDATE_NOTE_TIME:
      return Object.assign({}, state, {
        nextNoteTime: action.nextNoteTime,
        currentNote: action.currentNote
      });
    case SET_PLAY_STATUS:
      return Object.assign({}, state, {
        isPlaying: action.isPlaying
      });
    case SET_TIMEOUT_ID:
      return Object.assign({}, state, {
        timeoutId: action.timeoutId
      });
    default:
      return state;
  }
};

export default synthReducers;
