import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';
import styles from './ContactData.module.css';

const ContactData = props => {

    //STATE
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zip: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Zip Code'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'fastest', displayValue: 'Fastest' },
                    { value: 'cheapest', displayValue: 'Cheapest' },
                ]
            },
            value: 'fastest',
            valid: true,
            validation: {}
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);

    //DISPATCH
    const dispatch = useDispatch();
    const onOrderBurger = (orderData, token) => dispatch(actions.purchaseBurger(orderData, token));

    //SELECTORS
    const [
        ingredients,
        totalPrice,
        loading,
        token,
        userId
    ] = useSelector(state => {
        return [
            state.burgerBuilder.ingredients,
            state.burgerBuilder.totalPrice,
            state.order.loading,
            state.auth.token,
            state.auth.userId
        ]
    });


    const orderHandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: ingredients,
            price: totalPrice,
            orderData: formData,
            userId: userId
        };

        onOrderBurger(order, token);

    };

    const inputChangedHandler = (event, inputIdentifier) => {

        const updatedFormElement = updateObject(
            orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(
                event.target.value,
                orderForm[inputIdentifier].validation
            ),
            touched: true
        });
        const updatedOrderForm = updateObject(
            orderForm,
            { [inputIdentifier]: updatedFormElement }
        );
        let formIsValid = true;
        for (let inputIdentifiers in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid;
        }

        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid);
    }

    const formElementsArray = [];
    for (let key in orderForm) {
        formElementsArray.push({
            id: key,
            config: orderForm[key]
        });
    }

    let form = (
        <form onSubmit={orderHandler}>
            {formElementsArray.map(formElement => (
                <Input
                    key={formElement.id}
                    elementType={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.value}
                    changed={(event) => inputChangedHandler(event, formElement.id)}
                    invalid={!formElement.config.valid}
                    shouldValidate={formElement.config.validation}
                    touched={formElement.config.touched} />
            ))}
            <Button
                btnType="Success"
                disabled={!formIsValid}>
                ORDER
                </Button>
        </form>);
    if (loading) {
        form = <Spinner />;
    }

    return (
        <div className={styles.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
    );
};

export default withErrorHandler(ContactData, axios);