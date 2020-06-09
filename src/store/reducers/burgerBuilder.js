import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    ingredients: null,
    totalPrice: 4,
    error: false,
    building: false
};

const INGREDIENT_PRICES = {
    lettuce: 0.5,
    cheese: 1.5,
    meat: 3,
    bacon: 2.5
}

const addIngredient = (state, action) => {
    const updatedAddIngredient = { [action.ingredient]: state.ingredients[action.ingredient] + 1 };
    const updatedAddIngredients = updateObject(state.ingredients, updatedAddIngredient);
    const updatedAddState = {
        ingredients: updatedAddIngredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredient],
        building: true
    }
    return updateObject(state, updatedAddState);
}

const removeIngredient = (state, action) => {
    const updatedRemoveIngredient = { [action.ingredient]: state.ingredients[action.ingredient] - 1 };
    const updatedRemoveIngredients = updateObject(state.ingredients, updatedRemoveIngredient);
    const updatedRemoveState = {
        ingredients: updatedRemoveIngredients,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredient],
        building: true
    }
    return updateObject(state, updatedRemoveState);
}

const setIngredients = (state, action) => {
    return updateObject(state, {
        ingredients: {
            bacon: action.ingredients.bacon,
            cheese: action.ingredients.cheese,
            meat: action.ingredients.meat,
            lettuce: action.ingredients.lettuce
        },
        totalPrice: 4,
        error: false,
        building: false
    });
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
        case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
        case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
        case actionTypes.FETCH_INGREDIENTS_FAILED: return updateObject(state, { error: true })
        default: return state;
    }
};

export default reducer;