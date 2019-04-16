import React from 'react';
import {Button, AppBar, Fab, Icon,Divider, Toolbar,Select, Input,InputLabel , MenuItem, Checkbox,ListItemText,Snackbar,FormControlLabel, ListItem, Badge, List, Typography,CircularProgress, IconButton, InputBase, Grid} from '@material-ui/core'
import Slider from "react-slick";
import ArrowBack from '@material-ui/icons/ChevronRight'
import ArrowForward from '@material-ui/icons/ChevronLeft'
import Favorite from '@material-ui/icons/Favorite';
import {setWishList, getToken} from '../../actions';
import { connect} from 'react-redux';
import Cookie from '../../lib/Cookie'
import Single from './Single';

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <ArrowBack className={className } onClick={onClick} />

    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <ArrowForward className={className } onClick={onClick}/>

    );
}
let main;
let cookie = new Cookie();
let resultTotal;
class displayResult extends React.Component {
    state = {
        single: '',
        showSingle: false
    }

    componentDidMount(){
        let wishListCookie= cookie.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            this.props.setWishList(JSON.parse(wishListCookie))
            this.props.getToken()
        }



    }

    handleMouseEnter = (lat, lng,name,img, e) => {
        let cord = []
        cord.push({
            name: name,
            lat: lat,
            lng: lng,
            img: img
        })
        this.setState({
            cord,
            zoom: 16
        })
    }
    addToWishlist = (id, path) => {
        let arr = this.props.wishList
        arr.push({ id: id,image: path})
        this.props.setWishList(arr)
        cookie.checkCookie(this.props.wishList)
        let passToParent = {}
        passToParent = {wishListArray:arr, update: id, showSnackBar: true}
        this.props.getResultsData(passToParent);


    }
    loadSingle = (id, path) => {
      //  return this.setState({single: id,showMe:false})

        let singleData = {}
        singleData = {single: id, showMe: false}
       return  this.props.getSingleData( singleData);
    }

    resultLoop = (result, num = 6, select = 'all') => {

        if(this.props.sort && result.length > 0) {
            this.sortArray(result, 'loc_title', false)
        }
        var settings = {
            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />
        };

        console.log(num);

        resultTotal = 0
        main =  result.length > 0  && result.map((name, i) => {

            if(  name[select] === '1' ) {

                resultTotal += 1

                while (i < num) {

                    // let path = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img
                    let path = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img
                    let path2 = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img2
                    let path3 = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img3

                    return (<div className="result_list" key={i} id={name.loc_id}>


                        <div
                            className="img_wrapper"
                            onMouseEnter={this.handleMouseEnter.bind(this, name.lat, name.lng, name.loc_title, path)}
                        >
                            <Slider  {...settings}>
                                <Button onClick={() => this.loadSingle(name.loc_id)} style={{display: 'block'}}>
                                    <img width="290" src={path} style={{minHeight: '200'}}/>
                                </Button>
                                <Button onClick={() => this.loadSingle(name.loc_id)} style={{display: 'block'}}>
                                    <img width="290" src={path2} style={{minHeight: '200'}}/>
                                </Button>
                                <Button onClick={() => this.loadSingle(namenpm .loc_id)} style={{display: 'block'}}>
                                    <img width="290" src={path3} style={{minHeight: '200'}}/>
                                </Button>
                            </Slider>

                            <Button onClick={() => this.loadSingle(name.loc_id)} style={{display: 'block'}}>
                                <h4><strong>{name.loc_title}</strong></h4>
                            </Button>
                                <h6>Search path: {name.category_path_names}</h6>
                                <p>Type:
                                    <span>{name.commercial === '1' ? 'Commercial' : ''}</span><br/>
                                    <span>{name.residential === '1' ? 'Residential' : ''}</span><br/>
                                    <span>{name.production === '1' ? 'Production' : ''}</span><br/>
                                </p>
                                <p>{name.postcode}</p>
                                {name.exclusive === '0' ? '' : (<Icon>star_icon </Icon>)}
                                <span className="wisth_btn">
                                <span>
                                    <Favorite onClick={() => this.addToWishlist(name.loc_id, path)}/>
                                </span>
                            </span>

                        </div>


                    </div>)

                }
            }
        })
        this.props.getResultTotal(resultTotal)
        return main;

    }


    render() {
      
        return (
            <React.Fragment>
                {this.state.single
                    ?
                    <Single  token={this.props.token} id={this.state.single} />
                    :
                this.props.result.length > 0  ?
                this.resultLoop(
                                    this.props.result,
                                    this.props.num,
                                    this.props.select,
                                    this.props.sort
                ) : ''
                      }
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList,
    token: state.token.token
})
export default connect(mapStateToProps,{setWishList, getToken} )(displayResult);