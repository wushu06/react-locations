import * as actionTypes from '../actions/Types';
const initialUserState = {
    token: null,

}

export const token_reducer = (state = initialUserState, action) => {
    switch (action.type){
        case actionTypes.GET_TOKEN:
            return {
                token: action.payload.token,

            }
        default:
            return state;
    }

}