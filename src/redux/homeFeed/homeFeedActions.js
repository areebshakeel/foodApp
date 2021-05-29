import axios from 'axios';
import {homeFeedActionsTypes} from './homeFeedActionsTypes';
import {path} from '../../config/path';

const options = {
  Headers: {
    Authorization: 'Bearer',
    'Content- Type': 'application / x - www - form - urlencoded',
    Accept: 'application / json',
  },
};

export function homeFeedRequest(body) {
  return (dispatch) => {
    axios
      .post(path.HOME_FEED_API, {lat: 32271.2344, long: 232323.3232})
      .then((res) => {
        // console.log('Home Feed Reducer-->>', res);
        return dispatch({
          type: homeFeedActionsTypes.HOME_FEED_REQUEST,
          res,
        }).catch((error) => {
          // console.log(error);
        });
      });
  };
}

export const homeFeedSuccess = async (body) => {
  return {
    type: homeFeedActionsTypes.HOME_FEED_SUCCESS,
    data: body,
  };
};

export const homeFeedFailed = (body) => ({
  return: {
    type: homeFeedActionsTypes.HOME_FEED_FAILED,
    data: body,
  },
});
