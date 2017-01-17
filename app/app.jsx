import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';

import SynthEditor from './components/synth-editor';

const reducer = combineReducers(Object.assign({}, reducers));

const mountNode = document.getElementById('app');

const store = createStore(reducer);

const logState = state => { console.log(store.getState()); };

//store.subscribe(logState);

ReactDOM.render(
  <Provider store={ store }>
    <SynthEditor />
  </Provider>,
  mountNode
);
