import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

// redux thunk middleware
const middleware = [thunk];

// the store object
const store = createStore(
	rootReducer,
	initialState,
	applyMiddleware(...middleware)
);

export default store;