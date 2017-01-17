const createNewBar = (length = 16, note = null) => new Array(length).fill(note);

const initSynthContext = () => {
  const context = new AudioContext();
  const masterGain = context.createGain();

  masterGain.gain.value = 0.7;
  masterGain.connect(context.destination);

  return { context, masterGain }
};

const play = (synth, scheduler = null, updateNoteTime = null, setPlayStatus = null) => {
  const isPlaying = !synth.isPlaying;

  console.log('isPlaying: ', isPlaying);

  if(!scheduler) {
    return new Error('2nd argument must be a scheduler function');
  }

  if(setPlayStatus) {
    setPlayStatus(isPlaying);
  } else {
    synth.isPlaying = isPlaying;
  }

  if(synth.isPlaying) {
    let currentNote = 0;
    let nextNoteTime = synth.context.currentTime;

    if(updateNoteTime) {
      updateNoteTime({ nextNoteTime, currentNote });
    } else {
      synth.nextNoteTime = nextNoteTime;
      synth.currentNote = currentNote;
    }
  }

  if(isPlaying) {
    return requestAnimationFrame((rafTime) => {
      console.log('raf looping', synth);
      scheduler(synth, updateNoteTime);
    });
  } else {
    cancelAnimationFrame(synth.timeoutId);
    return null;
  }
};

const setNextNote = (synth) => {
  // Advance current note and time by 16th
  const secondsPerBeat = 60.0 / synth.tempo;
  const nextNoteTime = synth.nextNoteTime + 0.25 * synth.secondsPerBeat; // add beat length to last beat time
  let currentNote = synth.currentNote + 1; 

  if(currentNote == 16) {
    // wrap back to beginning of bar
    currentNote = 0;
  }

  return {
    secondsPerBeat,
    nextNoteTime,
    currentNote
  }
};

const scheduleNote = (synth) => {
  const sq1 = synth.context.createOscillator();
  const sq2 = synth.context.createOscillator();
  const tri = synth.context.createOscillator();
  const nos = synth.context.createOscillator();

  sq1.type = 'square';
  sq2.type = 'square';
  tri.type = 'triangle';
  nos.type = 'sawtooth'; // temp for testing

  sq1.frequency.value = synth.bars[0].sq1[synth.currentNote].note;
  sq2.frequency.value = synth.bars[0].sq2[synth.currentNote].note;
  tri.frequency.value = synth.bars[0].tri[synth.currentNote].note;
  nos.frequency.value = synth.bars[0].nos[synth.currentNote].note;

  sq1.connect(synth.context.destination);
  sq2.connect(synth.context.destination);
  tri.connect(synth.context.destination);
  nos.connect(synth.context.destination);

  sq1.start(synth.nextNoteTime);
  sq2.start(synth.nextNoteTime);
  tri.start(synth.nextNoteTime);
  nos.start(synth.nextNoteTime);

  sq1.stop(synth.nextNoteTime + synth.bars[0].sq1[synth.currentNote].length);
  sq2.stop(synth.nextNoteTime + synth.bars[0].sq2[synth.currentNote].length);
  tri.stop(synth.nextNoteTime + synth.bars[0].tri[synth.currentNote].length);
  nos.stop(synth.nextNoteTime + synth.bars[0].nos[synth.currentNote].length);

  return true;
};

const scheduler = (synth, updateNoteTime = null) => {
  // schedule notes and advance pointer

  while(synth.nextNoteTime < synth.context.currentTime + synth.scheduleAheadTime) {
    scheduleNote(synth);
    const nextNote = setNextNote(synth);

    if(updateNoteTime) {
      updateNoteTime(nextNote)
    } else {
      synth.nextNoteTime = nextNote.nextNoteTime;
      synth.currentNote = nextNote.currentNote;
    }
  }
};

export {
  createNewBar,
  initSynthContext,
  scheduler,
  setNextNote,
  scheduleNote,
  play
}

export default {
  createNewBar,
  initSynthContext,
  scheduler,
  setNextNote,
  scheduleNote,
  play
};
