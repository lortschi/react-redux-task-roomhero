import { NEW_POST } from '../actions/types';

const initialState = {
  	item: []
}

/**
 * The reducer function
 * 
 * @param {Object} state of params that will be stored
 * @param {Object} action delivered from redux action
 * 
 * @returns {Object} reducer response
 */
export default function (state = initialState, action) {
	if (NEW_POST) {
		return {
			...state,
			item: action.payload !== undefined && action.payload._id !== '' ? [...state.item, action.payload] : ''
		}
	}
}