import {combineReducers} from 'redux';
import language from './language';
import immersion from './immersion';

export default combineReducers({
  language,
  immersion
});
