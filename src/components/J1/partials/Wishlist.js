import React from 'react';
import { Grid, Fab, Snackbar} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import {connect} from "react-redux";
import {setWishList} from "../../../actions";
import axios from 'axios'

class Wishlist extends React.Component {
    state = {
        locations: [],
        loading: false,
        id:[],
        title: '',
        content: '',
        image: [],
        wishListArray: [],
        reduxWishList: this.props.wishList,
        showSnackBar: false,
    }

    componentDidMount() {
        let wishListArray = this.props.wishList
        let _self = this
        this.setState({wishListArray: this.props.wishList})


        let locationURL =  "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";


        axios.get(locationURL)
            .then(function (response) {

                _self.setState({
                    locations: response.data,
                    loading: false
                })

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }

    displayWishlist = (wishListArray) => {

         let arr = wishListArray
         let check = []

        return  this.state.locations.length > 0 && this.state.locations.map((location, i)=> {

               return arr.map(res => {

                   if(res.id === location.location_id) {
                        if(check.indexOf(res.id) === -1) {
                            check.push(res.id)
                            return (<div className="result_list" key={res.id}>
                                <img src={res.image} alt="" width="200"/>
                                <h2>Location name: {location.name}</h2>
                                <div className="wish_delete">
                            
                               <span onClick={() => this.deleteWishtList(res.image)}>
                                   <DeleteIcon/>
                               </span>
                                </div>
                            </div>)
                        }
                   }
               })



        })
    }
    deleteWishtList = (image) => {
        let arr = this.state.wishListArray
        let ar = []
         //arr.map(allres=> {
             arr.map(res => {
                if(res.image !== image) {

                   return ar.push(res)

                }

            })
       // })

        this.props.setWishList(ar)
        this.checkCookie(ar)
        this.setState({wishListArray: ar, showSnackBar: true})

    }
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
    checkCookie = (ar) =>{
        let wishListCookie= this.getCookie("wishListCookie");

        wishListCookie = JSON.stringify(ar);

        this.setCookie("wishListCookie", wishListCookie, 30);


    }

    handleClose = () => {
        this.setState({ showSnackBar: false });
    }

    render() {

        return (
            <div className="Wishlist">
                {this.state.wishListArray.length > 0 &&  this.displayWishlist(this.state.wishListArray)}

                {this.state.showSnackBar && <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.showSnackBar}
                    autoHideDuration={2000}
                    onClose={this.handleClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id="message-id">Location has been removed from your wishlist</span>}
                />
                }
            </div>

        )
    }
}
const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList

})
export default connect(mapStateToProps, {setWishList} )( Wishlist);