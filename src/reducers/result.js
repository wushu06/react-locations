import * as actionTypes from "../actions/Types";

const initialResultState = {
    result: [],

}

export const get_result_reducer = (state = initialResultState, action) => {

    switch (action.type){

        case actionTypes.GET_RESULT:
            return {
                result: action.payload.result,
            }
        default:
            return state;
    }

}