import { authAPI, securityAPI } from '../api/api';
import { stopSubmit } from 'redux-form';

const SET_AUTH_USER_DATA = 'SET-AUTH-USER-DATA';
const GET_CAPTCHA_URL_SUCCESS = 'GET-CAPTCHA-URL-SUCCESS';
//const TOGGLE_IS_LOADING = 'TOGGLE-IS-LOADING';

let initialState = {
   userId: null,
   email: null,
   login: null,
   //isLoading: false,
   isAuth: false,
   captchaUrl: null, 
}

const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case SET_AUTH_USER_DATA: {
         return {
            ...state,
            ...action.payload,
         }
      }
      case GET_CAPTCHA_URL_SUCCESS: {
         return {
            ...state,
            ...action.payload,
         }
      }
      // case TOGGLE_IS_LOADING: {
      //    return {
      //       ...state,
      //       isLoading: action.isLoading
      //    }
      // }
      default:
         return state;
   }
}

export const setAuthUserData = (userId, email, login, isAuth) => ({ type: SET_AUTH_USER_DATA, payload: { userId, email, login, isAuth } })
export const getCaptchaUrlSuccess = (captchaUrl) => ({ type: GET_CAPTCHA_URL_SUCCESS, payload: { captchaUrl } })

//export const toggleIsLoading = (isLoading) => ({ type: TOGGLE_IS_LOADING, isLoading })

//thunk

export const getAuthUserData = () => async (dispatch) => {
   const response = await authAPI.me();

   if (response.data.resultCode === 0) {
      const { id, email, login, } = response.data.data;
      dispatch(setAuthUserData(id, email, login, true))
   }
}

export const login = (email, password, rememberMe, captcha) => async (dispatch) => {
   const response = await authAPI.login(email, password, rememberMe, captcha);

   if (response.data.resultCode === 0) {
      dispatch(getAuthUserData())
   } else {
      //debugger
      if (response.data.resultCode === 10) {
         dispatch(getCaptchaUrl()) 
      }
      const message = response.data.messages.length > 0
         ? response.data.messages[0]
         : 'Some error'
      dispatch(stopSubmit('login', { _error: message }))
   }
}

export const getCaptchaUrl = () => async (dispatch) => {
   const response = await securityAPI.getCaptchaUrl();
   const captchaUrl = response.data.url;
   dispatch(getCaptchaUrlSuccess(captchaUrl))
}

export const logout = () => async (dispatch) => {
   const response = await authAPI.logout();

   if (response.data.resultCode === 0) {
      dispatch(setAuthUserData(null, null, null, false))
   }
}

export default authReducer;