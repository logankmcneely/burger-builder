import axios from 'axios';

import * as actionTypes from './actionTypes';

const SIGN_UP_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
const SIGN_IN_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='
const API_KEY = 'AIzaSyDTsbXky-wrAeX7wFhsv612IwGHytti4qY'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId

    };
};

export const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    };
};

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    }
}

export const auth = (email, password, isSignup) => {
    return dispatch => {
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        dispatch(authStart());
        const URL = isSignup? SIGN_UP_URL : SIGN_IN_URL;
        axios.post(URL + API_KEY, authData)
            .then(response => {
                console.log(response);
                dispatch(authSuccess(
                    response.data.idToken,
                    response.data.localId
                ));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                dispatch(authFailed(error.response.data.error));
            });
    };
};