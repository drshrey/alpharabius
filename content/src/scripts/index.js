import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Store} from 'react-chrome-redux';

import App from './components/app/App';

const proxyStore = new Store({portName: 'alpharabius'});

const anchor = document.createElement('div');
anchor.id = 'rcr-anchor';

anchor.style.visibility = 'visible';

if(document.baseURI.startsWith('http://www.nytimes.com')){
  let content = document.getElementsByClassName('story theme-main')[0];
  if(content != null){
    content.parentNode.insertBefore(anchor, content.nextSibling);
  }
}

if(document.baseURI.startsWith('https://aeon.co/essays')){
  let content = document.getElementsByClassName('follow-topics-banner')[0];
  if(content != null){
    content.parentNode.insertBefore(anchor, content);
  }
}

// window.onscroll = function(ev) {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//         anchor.style.visibility = 'visible';
//     } else {
//       anchor.style.visibility = 'hidden';
//     }
// };

render(
  <Provider store={proxyStore}>
    <App/>
  </Provider>
  , document.getElementById('rcr-anchor'));
