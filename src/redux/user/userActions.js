import {userActionTypes} from './userActionTypes';
import axios from 'axios';
import {path} from '../../config/path';

// type:userActionTypes.USER_LOGIN_REQUEST,
// payload
const formData = new FormData();
export function userLoginRequest(payLoad) {
  console.log('Data from component ->> ', payLoad);
  formData.append('email', payLoad.email);
  formData.append('password', payLoad.password);
  console.log('FormData-->>> ', formData);
  return (dispatch) => {
    axios
      .post(path.LOGIN_API, formData)
      .then((res) => {
        return dispatch({
          type: userActionTypes.USER_LOGIN_SUCCESS,
          res,
        });
      })
      .catch((error) => {
        return dispatch({
          type: userActionTypes.USER_LOGIN_FAILED,
          error: error.message,
        });
      });
  };
}

export const userLoginSuccess = async (payload) => {
  console.log('data from component-->', payload);
  console.log('response', res);
  return {
    type: userActionTypes.USER_LOGIN_SUCCESS,
    data: payload,
  };
};

export const USER_LOGIN_FAILED = (payload) => ({
  type: userActionTypes.USER_LOGIN_FAILED,
  payload,
});
