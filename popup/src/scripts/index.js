import React from 'react';
import {render} from 'react-dom';

import App from './components/app/App';

import {Store} from 'react-chrome-redux';
import {Provider} from 'react-redux';

const proxyStore = new Store({
  portName: 'selectivetrans'
});

render(
    <Provider store={proxyStore}>
      <App />
    </Provider>
  , document.getElementById('app'));
