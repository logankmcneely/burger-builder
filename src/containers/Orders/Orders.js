import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Order from '../../components/Order/Order';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';


const Orders = props => {

    //DISPATCH
    const dispatch = useDispatch();
    const onFetchOrders = useCallback(
        (token, userId) => dispatch(actions.fetchOrders(token, userId)),
        [dispatch]
    );

    //SELECTORS
    const [
        orders,
        loading,
        token,
        userId
    ] = useSelector(state => {
        return [
            state.order.orders,
            state.order.loading,
            state.auth.token,
            state.auth.userId
        ]
    });

    useEffect(() => {
        onFetchOrders(token, userId);
    }, [onFetchOrders, token, userId])


    let orderContainer = <Spinner />;
    if (!loading) {
        orderContainer = orders.map(order => (
            <Order
                key={order.id}
                ingredients={order.ingredients}
                price={order.price} />
        ))
    }
    return orderContainer;

};

export default withErrorHandler(Orders, axios);