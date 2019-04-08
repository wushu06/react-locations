import * as actionTypes from "../actions/Types";

const initialWishListState = {
    setWishList: [],

}

export const wish_list_reducer = (state = initialWishListState, action) => {
    switch (action.type){
        case actionTypes.SET_WISH_LIST:
            return {
                setWishList: action.payload.setWishList,
            }
        default:
            return state;
    }

}