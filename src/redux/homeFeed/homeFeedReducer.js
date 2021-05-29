import {userActionTypes} from '../user/userActionTypes';
import {homeFeedActionsTypes} from './homeFeedActionsTypes';

const INITIAL_STATE = {
  loading: false,
  error: null,
};

const homeFeedReducer = (state = INITIAL_STATE, action) => {
  // console.log('action in homefeed-->>', action);
  switch (action.type) {
    case homeFeedActionsTypes.HOME_FEED_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case homeFeedActionsTypes.HOME_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    default: {
      return {...state};
    }
  }
};

export default homeFeedReducer;
