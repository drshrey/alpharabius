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
} else if(document.baseURI.startsWith('https://aeon.co/essays')){
  let content = document.getElementsByClassName('follow-topics-banner')[0];
  if(content != null){
    content.parentNode.insertBefore(anchor, content);
  }
} else {
  anchor.style.visibility = 'hidden';
  anchor.style.opacity = '0';
  anchor.style.display = 'none';
  document.body.insertBefore(anchor, document.body.childNodes[0]);  
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
