const createNewBar = (length = 16, note = null) => new Array(length).fill(note);

const initSynthContext = () => {
  const context = new AudioContext();
  const masterGain = context.createGain();

  masterGain.gain.value = 0.7;
  masterGain.connect(context.destination);

  return { context, masterGain }
};

const play = (synth, clockData, clockWorker = null, setPlayStatus = null) => {
  clockData.isPlaying = !clockData.isPlaying;

  console.log('isPlaying: ', clockData.isPlaying);

  if(clockData.isPlaying) {
    let currentNote = 0;
    let nextNoteTime = synth.context.currentTime;

    clockData.nextNoteTime = nextNoteTime;
    clockData.currentNote = currentNote;
  }

  if(clockWorker) {
    if(clockData.isPlaying) {
      clockWorker.postMessage('start');
    } else {
      clockWorker.postMessage('stop');
    }
  }

 // if(isPlaying) {
 //   return requestAnimationFrame((rafTime) => {
 //     console.log('raf looping', synth);
 //     scheduler(synth, updateNoteTime);
 //   });
 // } else {
 //   cancelAnimationFrame(synth.timeoutId);
 //   return null;
 // }

    return null;
};

const setNextNote = (synth, clockData) => {
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

const scheduleNote = (synth, clockData) => {
  const sq1 = synth.context.createOscillator();
  const sq2 = synth.context.createOscillator();
  const tri = synth.context.createOscillator();
  const nos = synth.context.createOscillator();

  sq1.type = 'square';
  sq2.type = 'square';
  tri.type = 'triangle';
  nos.type = 'sawtooth'; // temp for testing

  sq1.frequency.value = synth.bars[0].sq1[clockData.currentNote].note;
  sq2.frequency.value = synth.bars[0].sq2[clockData.currentNote].note;
  tri.frequency.value = synth.bars[0].tri[clockData.currentNote].note;
  nos.frequency.value = synth.bars[0].nos[clockData.currentNote].note;

  sq1.connect(synth.context.destination);
  sq2.connect(synth.context.destination);
  tri.connect(synth.context.destination);
  nos.connect(synth.context.destination);

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

const scheduler = (synth, clockData) => {
  // schedule notes and advance pointer

  console.log('run scheduler');

  while(clockData.nextNoteTime < synth.context.currentTime + clockData.scheduleAheadTime) {
    scheduleNote(synth, clockData);
    console.log('loop');
    const nextNote = setNextNote(synth);

    clockData.nextNoteTime = nextNote.nextNoteTime;
    clockData.currentNote = nextNote.currentNote;
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
