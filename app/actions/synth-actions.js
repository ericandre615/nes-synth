import { SET_NOTE_DATA, INIT_AUDIO_CONTEXT, UPDATE_NOTE_TIME, SET_PLAY_STATUS, SET_TIMEOUT_ID } from './action-types';

export function setNoteData(note) {
  return {
    type: SET_NOTE_DATA,
    note
  };
};

export function initAudioContext({ context, masterGain }) {
  return {
    type: INIT_AUDIO_CONTEXT,
    context,
    masterGain
  };
}

export function updateNoteTime({ nextNoteTime, currentNote  }) {
  return {
    type: UPDATE_NOTE_TIME,
    nextNoteTime,
    currentNote
  };
};

export function setPlayStatus(isPlaying) {
  return {
    type: SET_PLAY_STATUS,
    isPlaying
  };
};

export function setTimeoutId(timeoutId) {
  return {
    type: SET_TIMEOUT_ID,
    timeoutId
  }
};

export default { setNoteData, initAudioContext, updateNoteTime, setPlayStatus, setTimeoutId };
