import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';

import { wrapStore} from 'react-chrome-redux';

const store = createStore(rootReducer,{});

chrome.storage.local.get(["alreadyInstalled"], function(items){  
    chrome.tabs.create({
        url: "http://alpharabi.us/signup"
    });    
    if(items['alreadyInstalled'] == 'true'){
        chrome.tabs.create({
            url: "http://alpharabi.us/signup"
        });
        chrome.storage.sync.set({"alreadyInstalled": "true"}, function(){});
        chrome.storage.local.set({"alreadyInstalled": "true"}, function(){});
    }
})

wrapStore(store, {
  portName: 'selectivetrans'
});
