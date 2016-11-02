import {combineReducers} from 'redux';
import language from './language';
import immersion from './immersion';
import power from './power';

export default combineReducers({
  language,
  immersion,
  power
});
