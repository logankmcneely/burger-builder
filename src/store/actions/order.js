import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    };
};

export const purcahseBurgerFailed = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error: error
    };
};

export const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START,
    };
};

export const purchaseBurger = (orderData) => {
    return dispatch => {
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json', orderData)
            .then(response => {
                dispatch(purchaseBurgerSuccess(response.data.name, orderData))
            })
            .catch(error => {
                dispatch(purcahseBurgerFailed(error));
            });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};

export const fetchOrdersSucces = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAILED,
        orders: orders
    }
};

export const fetchOrdersFailed = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAILED,
        error: error
    };
};

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = () => {
    return dispatch => {
        dispatch(fetchOrdersStart());
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                for (let key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                }
                dispatch(fetchOrdersSucces(fetchedOrders));
                console.log(fetchedOrders);
            })
            .catch(error => {
                dispatch(fetchOrdersFailed(error));
            });
    }
}