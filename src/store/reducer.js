import * as actionTypes from './actions';

const initialState = {
    ingredients: {
        bacon: 0,
        cheese: 0,
        lettuce: 0,
        meat: 1
    },
    totalPrice: 4,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredient]: state.ingredients[action.ingredient] + 1
                }
            };
        case actionTypes.REMOVE_INGREDIENT:
            return {
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredient]: state.ingredient[action.ingredient] > 0 ? state.ingredient[action.ingredient] + 1 : 0
                }
            };
        default:
            return state;
    }
};

export default reducer;