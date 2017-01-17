'use strict';

let timerId = null;
let interval = 100;

self.onmessage = function (e) {
  if(e.data == 'start') {
    console.log('starting worker');
    timerId = setInterval(() => {
        postMessage('tick');
      },
      interval
    );
  } else if (e.data.interval) {
    interval = e.data.interval;
    console.log('setting interval ', interval);

    if(timerId) {
      clearInterval(timerId);
      timerId = setInterval(() => {
          postMessage('tick');
        },
        interval
      );
    }
  } else if(e.data == 'stop') {
      console.log('stopping clock');
      clearInterval(timerId);
      timerId = null;
  }
};

postMessage('start synth worker');
