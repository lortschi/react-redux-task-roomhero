import { NEW_POST } from './types';

/**
 * Redux action function
 * 
 * @param {Object} post received from components
 * 
 * @returns {undefiend}
 */
function createPost(post) {
  return (dispatch) => {
    if (post === undefined) {
      return;
    }
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: false,
      body: JSON.stringify(post)
    })
    .then(res => res.json())
    .then(data => dispatch({
      type: NEW_POST,
      payload: data
    }));
  }
}

export { createPost };