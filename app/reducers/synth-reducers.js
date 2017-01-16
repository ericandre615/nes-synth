import { SET_NOTE_DATA } from '../actions/action-types';
import { synthActions } from '../actions';

const initialState = {
  bar: 1,
  beat: 0,
  note: 'A2',
  gain: 0,
  filter: null,
  length: 0,
  chan: 'sq1'
};

const synthReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTE_DATA:
      return Object.assign({}, state, {
        note: action.note
      });
    default:
      return state;
  }
};

export default synthReducers;
