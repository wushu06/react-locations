import * as actionTypes from "./Types";
import axios from "axios/index";

async function auth(){
    let tokenURL =  process.env.REACT_APP_TOKEN;
    let username = process.env.REACT_APP_USERNAME;
    let password = process.env.REACT_APP_PASSWORD;
    const user = new URLSearchParams()
    user.append('username', username)
    user.append('password', password)

    return  await axios.post(tokenURL, user)
        .then(function (response) {
            return  response.data.token;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

let  tokenPromise = auth().then(function(value){
    return  value
});

export const getToken = token => {
    return {
        type: actionTypes.GET_TOKEN,
        payload: {
            token: auth()
        }
    }
}