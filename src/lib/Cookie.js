import React from 'react';


class Cookie extends React.Component {



    setCookie = (cname,cvalue,exdays) =>{
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie = (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    checkCookieOnLoad = () => {
        let wishListCookie= this.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            console.log(wishListCookie);
          return true;

        }else{
            return false;
        }
    }
    checkCookie = (propsWishList) =>{
        let wishListCookie= this.getCookie("wishListCookie");
        wishListCookie = JSON.stringify(propsWishList);
        this.setCookie("wishListCookie", wishListCookie, 30);
    }

}


export default Cookie;