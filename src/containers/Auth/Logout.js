import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../store/actions/index';

const Logout = props => {

    //DISPATCH
    const dispatch = useDispatch();
    const onLogout = useCallback(
        () => dispatch(actions.logout()),
        [dispatch]
    );

    useEffect(() => {
        onLogout();
    }, [onLogout]);

    return <Redirect to="/" />;

}

export default Logout;