import { ERROR_CLEAR, REGISTRATION_FAIL, REGISTRATION_SUCCESS, SUCCESS_MESSAGE_CLEAR, USER_LOGIN_FAIL, USER_LOGIN_SUCCESS } from "../types/authType";
import { jwtDecode } from 'jwt-decode';

const authState = {
     loading : true,
     authenticate : false,
     error : '',
     successMessage: '',
     myInfo : ''
}

const tokenDecode = (token) =>{
     const tokenDecoded = jwtDecode(token);
     const expTime = new Date(tokenDecoded.exp*1000);
     if(new Date() > expTime){
          return null;
     }
     return tokenDecoded;

}

const token = localStorage.getItem('authToken');
if(token){
     const myInfo = tokenDecode(token);
     if(myInfo){
          authState.myInfo = myInfo;
          authState.authenticate = true;
          authState.loading = false;
     }
}
console.log('Token from local storage', token);

export const authReducer = (state = authState, action) => {
     const {payload,type} = action;

     if(type === REGISTRATION_FAIL || type === USER_LOGIN_FAIL){
          return {
               ...state,
               error : payload.error,
               authenticate : false,
               myInfo : '',
               loading : true
          }
     }

     if(type === REGISTRATION_SUCCESS || type === USER_LOGIN_SUCCESS){
          const myInfo = tokenDecode(payload.token);
          console.log('My info', myInfo);
          return{
               ...state,
               myInfo : myInfo,
               successMessage : payload.successMessage,
               error : '',
               authenticate : true,
               loading: false
          }
     }

     if(type === SUCCESS_MESSAGE_CLEAR){
        return {
             ...state,
             successMessage : ''
        }
   }

   if(type === ERROR_CLEAR){
        return {
             ...state,
             error : ''
        }
   }


     return state;
}