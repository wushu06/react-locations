import { combineReducers } from 'redux'
import {get_result_reducer} from './result';
import {token_reducer} from './token';
import {wish_list_reducer} from './wishlist';


const rootReducer = combineReducers({
    token: token_reducer,
    setWishList: wish_list_reducer,
    result: get_result_reducer
})

export default rootReducer;