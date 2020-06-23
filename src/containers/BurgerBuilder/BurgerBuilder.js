import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios-orders';

import Aux from '../../hoc/Auxillary/Auxillary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const onIngredientAdded = (ingredient) => dispatch(actions.addIngredient(ingredient));
    const onIngredientRemoved = (ingredient) => dispatch(actions.removeIngredient(ingredient));
    const onInitIngredients = useCallback(
        () => dispatch(actions.initIngredients()),
        [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    const [
        ingredients,
        totalPrice,
        error,
        isAuthenticated
    ] = useSelector(state => {
        return [
            state.burgerBuilder.ingredients,
            state.burgerBuilder.totalPrice,
            state.burgerBuilder.error,
            state.auth.token !== null
        ]
    });

    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients])


    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

    // {lettuce: true, bacon: false...}
    const disabledInfo = {
        ...ingredients
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    };

    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />;
    if (ingredients) {
        burger = (
            <Aux>
                <Burger ingredients={ingredients} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchaseable={updatePurchaseState(ingredients)}
                    ordered={purchaseHandler}
                    price={totalPrice}
                    isAuthenticated={isAuthenticated} />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ingredients}
            price={totalPrice}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />;
    }

    return (
        <Aux>
            <Modal
                show={purchasing}
                modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

}

export default withErrorHandler(BurgerBuilder, axios);