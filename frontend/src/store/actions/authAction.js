import axios from 'axios';
import { REGISTRATION_FAIL, REGISTRATION_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS } from '../types/authType';

export const userRegister = (data) => {
  return async (dispatch) => {
    const config = {
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data;`,
      },
    };

    try {
      const response = await axios.post('/api/messenger/user-registration', data, config);
      localStorage.setItem('authToken', response.data.token);
      console.log("Response from registration page", response.data);

      dispatch({
        type: REGISTRATION_SUCCESS,
        payload: {
          successMessage: response.data.successMessage,
          token: response.data.token
        }
      })
    } catch (error) {
      console.log("Error response", error.response.data);
      dispatch({
        type: REGISTRATION_FAIL,
        payload: {
          error: error.response.data.error.errorMessage
        }
      })
    }
  }
}

export const userLogin = (data) => {
  return async (dispatch) => {
    const config = {
      headers: {
          'Content-Type': 'application/json'
      }
    }

    try {
      const response = await axios.post('/api/messenger/user-login', data, config);
      localStorage.setItem('authToken', response.data.token);
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: {
          successMessage: response.data.successMessage,
          token: response.data.token
        }
      })
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: {
          error: error.response.data.error.errorMessage
        }
      })
    }
  }
}