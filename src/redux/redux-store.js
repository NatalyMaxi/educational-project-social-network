import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import authReducer from './auth-reducer';
import messagesReducer from './messages-reducer';
import profileReducer from './profile-reducer';
import sidebarReducer from './sidebar-reducer';
import usersReducer from './users-reducer';
import appReducer from './app-reducer';
import thunkMiddleware from 'redux-thunk';
import { reducer as formReducer } from 'redux-form'

let reducers = combineReducers({
   profilePage: profileReducer,
   messagesPage: messagesReducer,
   sidebar: sidebarReducer,
   usersPage: usersReducer,
   auth: authReducer,
   app: appReducer,
   form: formReducer,
});

let store = createStore(reducers, applyMiddleware(thunkMiddleware));

window.store = store;

export default store;
