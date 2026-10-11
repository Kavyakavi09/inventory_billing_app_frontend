import { combineReducers } from 'redux';

import invoices from './invoices';
import clients from './clients';
import profiles from './profiles';
import auth from './auth';
import assistant from './assistant';

export default combineReducers({ auth, profiles, clients, invoices, assistant });
