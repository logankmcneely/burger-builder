import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

const Checkout = props => {
    //SELECTORS
    const [
        ingredients,
        purchased
    ] = useSelector(state => {
        return [
            state.burgerBuilder.ingredients,
            state.order.purchased
        ]
    });

    const checkoutCancelledHandler = () => {
        props.history.goBack();
    }

    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data');
    }


    let summary = <Redirect to="/" />
    if (ingredients) {
        const purchasedRedirect = purchased ? <Redirect to="/" /> : null;
        summary = (
            <div>
                {purchasedRedirect}
                <CheckoutSummary
                    ingredients={ingredients}
                    onCheckoutCancelled={checkoutCancelledHandler}
                    onCheckoutContinued={checkoutContinuedHandler} />
                <Route
                    path={props.match.path + '/contact-data'}
                    component={ContactData} />
            </div>
        );
    }
    return summary;
};

export default Checkout;