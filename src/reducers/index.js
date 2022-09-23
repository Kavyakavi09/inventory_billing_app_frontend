import { combineReducers } from 'redux';

import invoices from './invoices';
import clients from './clients';
import profiles from './profiles';
import auth from './auth';

export default combineReducers({ auth, profiles, clients, invoices });
