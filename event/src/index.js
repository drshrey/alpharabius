import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore} from 'react-chrome-redux';

const store = createStore(rootReducer,{});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});

wrapStore(store, {
  portName: 'selectivetrans'
});
