import React, { useState, useEffect  } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import { useAlert } from 'react-alert';

import { userLogin } from "../store/actions/authAction";
import { ERROR_CLEAR, SUCCESS_MESSAGE_CLEAR } from "../store/types/authType";

const Login = () => {
    const navigate = useNavigate();
    const alert = useAlert();
    const {loading, authenticate, error, successMessage, myInfo} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    const  [state, setState] = useState({
        email: '',
        password: ''
    })


    const inputHandle = e => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const login = (e) => {
        e.preventDefault();
        console.log('Login state', state)
        dispatch(userLogin(state))
   }

   useEffect(()=>{
    if(authenticate){
         navigate('/');
    }
    if(successMessage){
         alert.success(successMessage);
         dispatch({type : SUCCESS_MESSAGE_CLEAR })
    }
    if(error){
         error.map(err=>alert.error(err));
         dispatch({type : ERROR_CLEAR })
    }

},[successMessage,error])

    return (
        <div className="register">
            <div className="card">
                <div className="card-header">
                    <h3>Login</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={login}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" onChange={inputHandle} name="email" value={state.email} className="form-control" placeholder="Email" id="email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" onChange={inputHandle} name="password" value={state.password} className="form-control" placeholder="Password" id="password" />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" className="btnLogin" />
                        </div>
                        <div className="form-group">
                            <span><Link to="/messenger/registration">Don't you have account? Register now</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
