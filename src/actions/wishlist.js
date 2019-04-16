import * as actionTypes from "./Types";

export const setWishList = wishList => {
    return {
        type: actionTypes.SET_WISH_LIST,
        payload: {
            setWishList: wishList
        }

    }
}

