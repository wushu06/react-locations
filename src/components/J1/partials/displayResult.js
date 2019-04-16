import React from 'react';
import {Button, Icon,Select, Input,InputLabel , MenuItem,  Grid} from '@material-ui/core'
import Slider from "react-slick";
import ArrowBack from '@material-ui/icons/ChevronRight'
import ArrowForward from '@material-ui/icons/ChevronLeft'
import Favorite from '@material-ui/icons/Favorite';
import SortIcon from '@material-ui/icons/SortByAlpha';
import {setWishList, getToken} from '../../../actions';
import { connect} from 'react-redux';
import Cookie from '../../../lib/Cookie'
import Single from '../Single';
import {Link} from 'react-router-dom'

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
let result = {}
let div = ''
let num = 6;
let resultTotal = 0
class displayResult extends React.Component {
    state = {
        single: '',
        resultTotal: 0,
        typeName: 'all',
        loading: true,
        showMore: false
    }


    componentDidMount(){
        let wishListCookie= cookie.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            this.props.setWishList(JSON.parse(wishListCookie))
         //   this.props.getToken()
        }
      //  console.log(this.props.token);


    }

    componentWillUnmount() {
        num = 6;     resultTotal = 0
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
    }
    loadSingle = (id, path) => {
        return this.setState({single: id,showMe:false})
    }
    sortArray = (arr, key, num = true ) => {
        if(num){
            arr.map(() => {
                arr.sort(function(a, b){
                    //return  a.key - b.key ;
                    return  a[key] - b[key] ;
                });
            });
        }else{
            arr.sort(function(a, b) {
                let textA = a[key].toUpperCase();
                let textB = b[key].toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    }
    sortResult = () => {
        this.setState(prevState => ({
            sort: !prevState.sort
        }));
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


         resultTotal = 0;



         main = result.length > 0  && result.map((name, i) => {

            if(  name[select] === '1' ) {



                while (i < num) {

                    if(this.state.typeName !== 'all' ){
                        console.log('here');
                        resultTotal +=1;
                    }else{
                        resultTotal =  result.length
                    }
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
                                    <Link to={{pathname: "/single/"+name.loc_id, param1: "Par1"}}>
                                        <img width="290" src={path} style={{minHeight: '200'}}/>
                                    </Link>
                                    <Link to={{pathname: "/single/"+name.loc_id, param1: "Par1"}}>
                                        <img width="290" src={path2} style={{minHeight: '200'}}/>
                                    </Link>
                                    <Link to={{pathname: "/single/"+name.loc_id, param1: "Par1"}}>
                                        <img width="290" src={path3} style={{minHeight: '200'}}/>
                                    </Link>
                                </Slider>

                                {/*<Button onClick={() => this.loadSingle(name.loc_id)} style={{display: 'block'}}>*/}
                                <Button  style={{display: 'block'}}>
                                    <Link to={{pathname: "/single/"+name.loc_id, param1: "Par1"}}>
                                        <h4><strong>{name.loc_title}</strong></h4>
                                    </Link>

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
      
       
        return {main: main, resultTotal: resultTotal }



    }
    componentWillReceiveProps(newProp, oldProp){

        this.setState({
            resultTotal: newProp.result.length
        })
    }

    handleTypeChange = event => {
        this.setState({ typeName: event.target.value });
        num = 6;
    }

    showMore = () => {
        this.setState({
            showMore: true
        })
        num += 6;
    }

    render() {
        div = this.resultLoop(
            this.props.result,
            6,
            this.state.typeName,
            this.props.sort
        )
        if(this.state.showMore) {
            div = this.resultLoop(
                this.props.result,
                num ,
                this.state.typeName,
                this.props.sort
            )
        }
       const {resultTotal} = this.state
        return (
           <React.Fragment>

                { this.props.result.length > 0  &&  (

                    <div className="result_total">
                    <div className="sort_filter">
                        <span>Results:<span className="fig"> {  div.resultTotal  } </span> </span>

                        <InputLabel htmlFor="select-multiple">Select type</InputLabel>
                        <Select
                            value={this.state.typeName}
                            onChange={this.handleTypeChange}
                            input={<Input id="select" />}
                        >
                            <MenuItem value="all">
                                {'All'}
                            </MenuItem>
                            <MenuItem value="commercial">
                                {'Commercial'}
                            </MenuItem>
                            <MenuItem value="residential">
                                {'Residential'}
                            </MenuItem>
                            <MenuItem value="production">
                                {'Production'}
                            </MenuItem>

                        </Select>
                    </div>
                </div>
                        )}



                <div className="result" data-type={this.state.typeName}>{
                        div.main
                    } </div>

                <div className="show_more">
                    {div.resultTotal > 0 && ((div.resultTotal - num)   > 0 ) ?
                        <Button variant="contained" color="secondary" onClick={() => this.showMore()}>See <span className="number">{(div.resultTotal - num ) } </span>more </Button> : ''}
                </div>


            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList,
    token: state.token.token
})
export default connect(mapStateToProps,{setWishList, getToken} )(displayResult);