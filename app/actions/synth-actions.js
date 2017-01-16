import { SET_NOTE_DATA } from './action-types';

export function setNoteData(note) {
  return {
    type: SET_NOTE_DATA,
    note
  };
};

export default { setNoteData };
