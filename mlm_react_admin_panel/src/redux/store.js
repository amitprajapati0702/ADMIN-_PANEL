import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import adminReducer from './reducers/adminReducer.js';
import generalSettingsReducer from './reducers/generalSettingReducer.js';
// import dashboardReducer from './reducers/dashboardReducer.js';
// import treeReducer from './reducers/treeReducer.js';
// import replicaReducer from './reducers/replica.js';
// import mailBoxReducer from './reducers/mailBoxReducer.js';

const rootReducer = combineReducers({
  admin: adminReducer,
  generalSettings: generalSettingsReducer,
  // tree: treeReducer,
  // dashboard: dashboardReducer,
  // replica: replicaReducer,
  // mail: mailBoxReducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default store;
