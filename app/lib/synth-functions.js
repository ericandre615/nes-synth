const createNewBar = (length = 16, note = null) => new Array(length).fill(note);

const initSynthContext = () => {
  const context = new AudioContext();
  const masterGain = context.createGain();

  masterGain.gain.value = 0.7;
  masterGain.connect(context.destination);

  return { context, masterGain }
};

const play = (synth, clockData, clockWorker = null, setPlayStatus = null, drawStep = drawStep) => {
  const isPlaying = !synth.isPlaying;

  if(setPlayStatus) {
    setPlayStatus(isPlaying);
  } else {
    synth.isPlaying = isPlaying;
  }

  if(isPlaying) {
    let nextNoteTime = synth.context.currentTime;

    clockData.nextNoteTime = nextNoteTime;
  }

  if(clockWorker) {
    if(isPlaying) {
      clockWorker.postMessage('start');
    } else {
      clockWorker.postMessage('stop');
    }
  }

//  if(isPlaying) {
//    return requestAnimationFrame(() => {
//      drawStep(clockData.currentNote)
//    });
//  } else {
//    cancelAnimationFrame(synth.timeoutId);
//    return null;
//  }

    return true;
};

const stop = (synth, clockData, clockWorker = null, setPlayStatus = null, drawStep = drawStep) => {
  const isPlaying = !synth.isPlaying;

  if(setPlayStatus) {
    setPlayStatus(isPlaying);
  } else {
    synth.isPlaying = isPlaying;
  }

  if(clockWorker) {
    if(!isPlaying) {
      clockWorker.postMessage('stop');
    }
  }

  if(isPlaying) {
    let nextNoteTime = synth.context.currentTime;

    clockData.nextNoteTime = nextNoteTime;
    clockData.currentNote = 0;
  }

  if(!isPlaying) {
    cancelAnimationFrame(synth.timeoutId);
    return null;
  }

  return true;
};

const resetPlayHead = (resetPosition = 0, clockData) => {
  clockData.currentNote = resetPosition;
  return clockData;
};

const setNextNote = (synth, clockData) => {
  // Advance current note and time by 16th
  const secondsPerBeat = 60.0 / synth.tempo;
  const nextNoteTime = clockData.nextNoteTime + 0.25 * secondsPerBeat; // add beat length to last beat time
  let currentNote = clockData.currentNote + 1;

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

const scheduleNote = (synth, clockData, noteMap) => {
  const sq1 = synth.context.createOscillator();
  const sq2 = synth.context.createOscillator();
  const tri = synth.context.createOscillator();
  const nos = synth.context.createOscillator();
  const sq1Gain = synth.context.createGain();
  const sq2Gain = synth.context.createGain();
  const triGain = synth.context.createGain();
  const nosGain = synth.context.createGain();

  sq1.type = 'square';
  sq2.type = 'square';
  tri.type = 'triangle';
  nos.type = 'sawtooth'; // temp for testing

  sq1.frequency.value = noteMap[synth.bars[0].sq1[clockData.currentNote].note].freq;
  sq2.frequency.value = noteMap[synth.bars[0].sq2[clockData.currentNote].note].freq;
  tri.frequency.value = noteMap[synth.bars[0].tri[clockData.currentNote].note].freq;
  nos.frequency.value = noteMap[synth.bars[0].nos[clockData.currentNote].note].freq;

  sq1Gain.gain.value = synth.bars[0].sq1[clockData.currentNote].gain;
  sq2Gain.gain.value = synth.bars[0].sq2[clockData.currentNote].gain;
  triGain.gain.value = synth.bars[0].tri[clockData.currentNote].gain;
  nosGain.gain.value = synth.bars[0].nos[clockData.currentNote].gain;

  sq1.connect(sq1Gain);
  sq2.connect(sq2Gain);
  tri.connect(triGain);
  nos.connect(nosGain);

  sq1Gain.connect(synth.context.destination);
  sq2Gain.connect(synth.context.destination);
  triGain.connect(synth.context.destination);
  nosGain.connect(synth.context.destination);

  sq1.start(clockData.nextNoteTime);
  sq2.start(clockData.nextNoteTime);
  tri.start(clockData.nextNoteTime);
  nos.start(clockData.nextNoteTime);

  sq1.stop(clockData.nextNoteTime + synth.bars[0].sq1[clockData.currentNote].length);
  sq2.stop(clockData.nextNoteTime + synth.bars[0].sq2[clockData.currentNote].length);
  tri.stop(clockData.nextNoteTime + synth.bars[0].tri[clockData.currentNote].length);
  nos.stop(clockData.nextNoteTime + synth.bars[0].nos[clockData.currentNote].length);

  return true;
};

const scheduler = (synth, clockData, noteMap) => {
  // schedule notes and advance pointer

  while(clockData.nextNoteTime < synth.context.currentTime + clockData.scheduleAheadTime) {
    scheduleNote(synth, clockData, noteMap);
    const nextNote = setNextNote(synth, clockData);

    clockData.nextNoteTime = nextNote.nextNoteTime;
    clockData.currentNote = nextNote.currentNote;
  }
};

const drawStep = (step = 0) => {
  requestAnimationFrame(() => {
    drawStep(step);
  });
};

export {
  createNewBar,
  initSynthContext,
  scheduler,
  setNextNote,
  scheduleNote,
  play,
  stop,
  resetPlayHead,
  drawStep
}

export default {
  createNewBar,
  initSynthContext,
  scheduler,
  setNextNote,
  scheduleNote,
  play,
  stop,
  resetPlayHead,
  drawStep
};
