import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {

    //STATE
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });
    const [isSignup, setIsSignup] = useState(true);

    //DISPATCH
    const dispatch = useDispatch();
    const onAuth = (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup));
    const onSetAuthRedirectPath = useCallback(
        () => dispatch(actions.setAuthRedirectPath('/')),
        [dispatch]
    );

    //SELECTORS
    const [
        loading,
        error,
        isAuthenticated,
        authRedirectPath,
        buildingBurger
    ] = useSelector(state => {
        return [
            state.auth.loading,
            state.auth.error,
            state.auth.token !== null,
            state.auth.authRedirectPath,
            state.burgerBuilder.building
        ]
    });


    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }
    }, [onSetAuthRedirectPath, buildingBurger, authRedirectPath]);

    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
            [controlName]: updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(
                    event.target.value,
                    controls[controlName].validation),
                touched: true
            })
        });

        setControls(updatedControls);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        onAuth(
            controls.email.value,
            controls.password.value,
            isSignup
        );
    }

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    }


    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        });
    }

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => inputChangedHandler(event, formElement.id)}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched} />

    ));

    if (loading) {
        form = <Spinner />;
    }

    let header = <h1>{isSignup ? "SIGN UP" : "SIGN IN"}</h1>

    if (error) {
        header = <p style={{ color: 'red' }}>{error.message}</p>
    }



    return (
        <div className={styles.Auth}>
            {isAuthenticated
                ? <Redirect to={authRedirectPath} />
                : null}
            {header}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">
                    Submit
                    </Button>
            </form>
            <Button
                btnType="Danger"
                clicked={switchAuthModeHandler}>
                SWITCH TO {isSignup ? "SIGN IN" : "SIGN UP"}
            </Button>
        </div>
    )

}

export default Auth;