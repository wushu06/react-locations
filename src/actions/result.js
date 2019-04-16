import * as actionTypes  from './Types';
import axios from 'axios'

/*
 * get all locations
 */
async function mainResult() {
// set locations results state
    let searchURL = "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";
    let categories = "http://phpstack-214959-744649.cloudwaysapps.com/categoyJson.php";

// Make a request for a user with a given ID
    return  await Promise.all([
        axios.get(searchURL),
        axios.get(categories)

    ])

}

mainResult().then(function(value){
    return value;
});



export const getResults = result => {
    return {
        type: actionTypes.GET_RESULT,
        payload: {
            result:  mainResult()
        }
    }
}

