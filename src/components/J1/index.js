import React from 'react';
import {Link} from 'react-router-dom'
import Header from '../../containers/Header';
import {Button, AppBar, Fab, Icon,Divider, Toolbar,Select, Input,InputLabel , MenuItem, Checkbox,ListItemText,Snackbar,FormControlLabel, ListItem, Badge, List, Typography,CircularProgress, IconButton, InputBase, Grid} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SortIcon from '@material-ui/icons/SortByAlpha';
import Search from '@material-ui/icons/SearchOutlined'
import ArrowBack from '@material-ui/icons/ChevronRight'
import ArrowForward from '@material-ui/icons/ChevronLeft'
import Spinner from '../../containers/UI/Spinner'
import Single from './Single';
import Wishlist from './Wishlist';
import axios from 'axios';
import $ from 'jquery'
import {TweenMax} from "gsap/TweenMax";
import Favorite from '@material-ui/icons/Favorite';
import {setWishList, getToken, getResults} from '../../actions';
import { connect} from 'react-redux';
import  { easing, tween } from  'popmotion'
import posed from "react-pose";
import Cookie from '../../lib/Cookie'
import Slider from "react-slick";
import MapJ1 from './MapJ1';
import DisplayResult from './displayResult';
import AutoComplete from '../../lib/AutoComplete';
import SearchInit from '../../lib/SearchInit'

let searchInit = new SearchInit();
let resultTotal;
let cookie = new Cookie();

let once = true;
const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'white',
        marginRight: '20px;',


        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',

        color: 'black',

        '&:hover': {

        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 180,
        },
        '&:focus': {
            width: 200,
        },
    },
});
let div = '';

let num = 6;


const Div = posed.div({
    idle: {
        opacity: 1,
        scale: 1,
        transition: (props) => tween({ ...props, duration: 300 })
    },
    hovered: {
        opacity: 0.9,
        scale: 1.1,
        transition: (props) => tween({ ...props, duration: 400 })
    }
});
const WishAnimate = posed.div({
    cliked: {
        opacity: 0.9,
        scale: 1.3,
        transition: (props) => tween({ ...props, duration: 300 })
    },
    uncliked: {
        opacity: 1,
        scale: 1,
        transition: (props) => tween({ ...props, duration: 400 })
    }
});

const ShowList = posed.div({
    cliked1: {
        opacity: 0.9,
        scale: 1.3,
        transition: (props) => tween({ ...props, duration: 300 })
    },
    uncliked2: {
        opacity: 1,
        scale: 1,
        transition: (props) => tween({ ...props, duration: 400 })
    }
});
var currentFocus = 0;
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
class SearchV3 extends React.Component {
    state = {
        loading: true,
        search: '',
        result: [],
        dupCheck: [],
        resultAutoComplete: [],
        filter: [],
        filterResult: '',
        hideFilterMore: false,
        showFilter: false,
        locations: [],
        suggestions: [],
        categories: [],
        cord: [],
        typeName: 'all',
        showMe: true,
        exact: false,
        exclusive: false,
        showRest: false,
        noResult: false,
        wishListId: '',
        wishListIdPath: '',
        showList:false,
        wishListArray: [],
        update: '',
        clicking: false,
        cliked1: false,
        oldSearch: [],
        numberOfResult: '',
        searchAll: false,
        length: 21,
        sort: false,
        showSnackBar: false,
        zoom: 6
    }
    componentWillMount(){
        this.props.getResults();
    }
    componentDidUpdate(){
        let self = this
        if(once) {
            (this.props.result).then(function (value) {
                self.setState({
                    loading: false,
                    locations: value[0].data,
                    categories: value[1].data,
                })
                once = false;
            });
        }
    }

    componentDidMount() {

        setTimeout(console.log.bind(console, "%c Collective Location by The Bigger Boat ⚓️ %c", "background: #f50057;color:#fff;padding:5px;border-radius: 5px;line-height: 26px;", ""));
        this.startTime = Date.now();
        let _self = this
        // checking if there is a cookie or not to show the Heart icon
        let wishListCookie= cookie.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            this.props.setWishList(JSON.parse(wishListCookie))
            this.props.getToken()
        }


        $(document).on('click', '.add_to', function () {
            TweenMax.to($(this).parents('.result_list'), 1, {
                border: '1px solid #f50057',

            });
        })



    }

    componentWillUpdate(){
        this.endTime = Date.now();
    }

    handleChange = event => {
        // this.triggerAxios()
        this.setState({search: event.target.value})
        this.setState({single: ''})

    }

    // check if object is empty
    isEmpty = (obj) => {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    // handle the search form submit
    handleSubmit = (event) => {
        event.preventDefault()
        this.manualSearch()
    }

    // handle the manual search if the option for it is ticked
    manualSearch = () => {
        this.startTime = Date.now();
        num = 6;
        this.state.search.length > 1 &&
        this.setState({loading: true, numberOfResult: ''},()=>{
            let res = searchInit.searchTerm(this.state.search,'',this.state.locations,this.state.searchAll, this.state.exclusive, this.state.result, this.state.dupCheck).result
            if (res.length > 0) {
                this.setState({loading: false, single: '', result: res,  noResult: false,  showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true,numberOfResult: '', showMe: true, sort: false});
            }
        })

    }

    manualSearchAutComplete = ( res, pair, e) => {

        this.startTime = Date.now();
        num = 6;
        this.setState({loading: true,   showFilter: true},()=>{
           // let result = this.searchTerm(this.state.search, res)
            let getResult = searchInit.searchTerm(this.state.search, res,this.state.locations,this.state.searchAll, this.state.exclusive, this.state.result, this.state.dupCheck)
            let result = getResult.result


            if (result.length > 0) {
                this.setState({
                    loading: false,
                    single: '',
                    result: result,
                    noResult: false,
                    resultAutoComplete: [],
                    search: '',
                    oldSearch:[pair, ...this.state.oldSearch],
                    showMe: true, sort: false,
                    cord: getResult.cord
                })
            } else {
                this.setState({
                    loading: false,
                    single: '',
                    result: [],
                    noResult: true,
                    resultAutoComplete: [],
                    search: '',
                    oldSearch:[pair, ...this.state.oldSearch],
                    numberOfResult: '',
                    showMe: true,
                    sort: false,
                    cord: []
                });
            }
        })

    }

    deleteSearchTerm = (i, filter) => {
        //this.searchAutoComplete(filter)
        let oldSearch = this.state.oldSearch
        oldSearch.length > 0 && oldSearch.splice(i,1);
        let result = []
        let dupCheck = []
        this.state.result.map(res=> {

            if(res.category_path_names !== filter.filter){
                result.push(res)
                dupCheck.push(res.id)
            }

        })
        this.setState({oldSearch:oldSearch })
        this.setState({loading: true},()=>{


            if (result.length > 0) {
                this.setState({loading: false, single: '',hideFilterMore: false, result: result,  noResult: false, resultAutoComplete: [], search: '', showMe: true, sort: false, numberOfResult: result.length, dupCheck})
            } else {
                this.setState({loading: false, single: '', result: [],hideFilterMore: false,  noResult: true, resultAutoComplete: [], search: '', showMe: true, sort: false, numberOfResult: result.length, dupCheck});
            }
        })
    }

    showMore = () => {
        return this.setState({showMe: false})
    }

    showWishlist = () => {
        return this.setState(prevState => ({
            showList: !prevState.showList
        }));
    }


    loadSingle = (id, path) => {
        return this.setState({single: id,showMe:false})
    }

    handleCheckChange = name => event => {
        this.setState({[name]: event.target.checked});
    };

    displayFilter = () => {

        return this.state.showFilter && this.state.filter.map((res, i)=> {
            let pair = {
                filter: res.filter,
                name: res.name
            }

            return(
                <div key={i} style={{width: '100%'}} className={this.isObjectContains(this.state.oldSearch,res.filter )}>
                    <ListItem button className="input display_filter" >
                        <ListItemText data-tag={res} className="autoComplete_item" inset primary={res.name +' ('+res.count+')'} secondary={res.filter} onClick={this.manualSearchAutComplete.bind(null, res.filter, pair)}/>

                    </ListItem>
                    {
                        (res.index >= 21 &&  !this.state.hideFilterMore  ) &&  ( <ListItem button className="input see_more_filter">
                            <ListItemText data-tag={res} className="autoComplete_item" inset primary={'See ' + this.state.filterResult+' more'} onClick={this.increaseFilter2}/>
                        </ListItem>)
                    }
                </div>

            )
        })
    }
    isObjectContains = (obj, val) => {
        return obj.map(f => { if(f.filter === val){return ('disabled filter_btn')}else{return ('')}})
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
    getResultsData = (data) => {
        this.setState({wishListArray:data.wishListArray, update: data.update, showSnackBar: data.showSnackBar})

    }
    sortResult = () => {
       // div = this.displayResult(this.state.result,num, this.state.typeName)
        div = <DisplayResult
                    result={this.state.result}
                    num={num}
                    select={this.state.typeName}
                    sort={this.state.sort}
                    getResultsData={this.getResultsData}
                />
        this.setState(prevState => ({
            sort: !prevState.sort
        }));


    }
    handleClose = () => {
        this.setState({ showSnackBar: false });
    }
    handleTypeChange = event => {
        div = ''
       this.setState({ typeName: event.target.value });
    }

    render() {

        const {search, result, loading, single,showSnackBar,  noResult,  showList, wishListArray, resultAutoComplete, oldSearch,numberOfResult, searchAll, showFilter, cord, zoom} = this.state
        const {classes} = this.props;
        const loadingTime =  ((this.endTime - this.startTime)/1000).toFixed(2)

        if (result.length > 0) {

          // div = this.displayResult(result)

        }else{
            div = ''
        }

        if (!this.state.showMe) {
            num += 6
           // div = this.displayResult(result, num)
            div = <DisplayResult
                    result={this.state.result}
                    num={num}
                    select={this.state.typeName}
                    sort={this.state.sort}
                    getResultsData={this.getResultsData}
                />
        }

        if(this.state.typeName){
           // div = this.displayResult(this.state.result, num, this.state.typeName)
            div = <DisplayResult
                        result={this.state.result}
                        num={num}
                        select={this.state.typeName}
                        sort={this.state.sort}
                        getResultsData={this.getResultsData}
                    />
        }
        return (
            <div>

                {single ? <Single id={single} token={ this.props.token} />
                    :
                    <div className="container_wrapper">

                        <AppBar position="fixed" className='search-header'>
                            <Toolbar className="toolbar">

                                <div className={classes.search}>

                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>

                                    <form onSubmit={this.handleSubmit}>
                                        <InputBase
                                            placeholder="Search…"
                                            autoComplete="off"
                                            onChange={this.handleChange}
                                            name="search"
                                            value={this.state.search}
                                            id="myInput"
                                            classes={{
                                                root: classes.inputRoot,
                                                input: classes.inputInput,
                                            }}
                                        />

                                        <AutoComplete search={this.state.search} categories={this.state.categories} manualSearchAutComplete={this.manualSearchAutComplete} />

                                    </form>
                                    <div className="check">
                                        {searchAll &&
                                        <Fab color="secondary" size="small" aria-label="Edit" className="search_btn" onClick={() => this.manualSearch()}>
                                            <Search/>
                                        </Fab>
                                        }

                                    </div>

                                </div>
                                <div className="exclusive">
                                    <FormControlLabel
                                        label="Exclusive"
                                        control={
                                            <Checkbox
                                                checked={this.state.exclusive}
                                                onChange={this.handleCheckChange('exclusive')}
                                                value="exclusive"
                                            />
                                        }

                                    />
                                </div>

                                <div className="searchAll">
                                    <FormControlLabel
                                        label="Search by location name"
                                        control={
                                            <Checkbox
                                                checked={searchAll}
                                                onChange={this.handleCheckChange('searchAll')}
                                                value="searchAll"
                                            />
                                        }

                                    />
                                </div>
                                <div>
                                    {this.props.wishList.length > 0 &&
                                    <WishAnimate
                                        onMouseEnter={() => this.setState({ clicking: true })}
                                        onMouseLeave={() => this.setState({ clicking: false })}
                                        pose={this.state.clicking ? "cliked" : "uncliked"}
                                    >
                                        <Badge  badgeContent={this.props.wishList.length} color="secondary">
                                            <Fab color="secondary" aria-label="Edit" size="small" onClick={() => this.showWishlist()}>
                                                <Favorite/>
                                            </Fab>
                                        </Badge>
                                    </WishAnimate>
                                    }
                                </div>
                            </Toolbar>
                        </AppBar>

                        <div className="container_wrapper_content">
                            <Grid container spacing={24} className="main">



                                {loading && <Spinner/>}

                                <Grid item md={12} xs={12}>
                                    <div className="old_search_wrapper">
                                        {oldSearch && !searchAll &&
                                        oldSearch.map((old, i)=> (
                                            <div className="concat_search" key={i}>
                                                <div className="old_search">
                                                    <div><span>{old.name} </span><Icon onClick={()=> this.deleteSearchTerm(i, old)}>cancel_icon</Icon></div>

                                                </div>
                                                <i className="fa fa-plus-circle"></i>
                                            </div>

                                        ))
                                        }
                                    </div>



                                </Grid>
                                <Grid item md={8} xs={8}>
                                    <div className="versions">
                                        <span><Link to="/locations">Current version </Link></span>
                                        <span><Link to="/searchv1">V1 </Link></span>
                                        <span><Link to="/searchv2">V2 </Link></span>
                                        <span><Link to="/searchv3">V3 </Link></span>

                                    </div>

                                    {(showList && this.props.wishList.length > 0) ?
                                        <ShowList
                                            onClick={() => this.setState(prevState => ({clicking: !prevState.clicking  }))}
                                            pose={this.state.clicking2 ? "cliked1" : "uncliked2"}
                                        >
                                            <div className="wish_container"><Wishlist array={wishListArray}  update={this.state.update}/></div>
                                        </ShowList> : ''}


                                    <List className={loading ? 'loading result' : 'result'}>
                                        {noResult ? <h2></h2> : ''}
                                        {div}
                                    </List>

                                    <div className="show_more">
                                        {numberOfResult && ((numberOfResult - num)   > 0 ) ?
                                            <Button variant="contained" color="secondary" onClick={() => this.showMore()}>See <span className="number">{(numberOfResult - num ) } </span>more </Button> : ''}
                                    </div>
                                </Grid>
                                <Grid item md={4} xs={4}>
                                    <Grid container spacing={24} className="main">
                                        <Grid item md={12} xs={12}>
                                            <div className="google_map">
                                                {(cord.length > 0 && oldSearch.length > 0) && <MapJ1 cord={cord} zoom={zoom} centerLat={cord[0].lat} centerLng={cord[0].lng}   /> }
                                            </div>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <div className="filter_wrapper">
                                                {(showFilter && oldSearch.length > 0) && ( <div><h2>Related</h2>{this.displayFilter()}</div>)}
                                            </div>
                                        </Grid>
                                    </Grid>

                                </Grid>

                            </Grid>
                        </div>


                        {showSnackBar && <Snackbar
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            open={showSnackBar}
                            autoHideDuration={2000}
                            onClose={this.handleClose}
                            ContentProps={{
                                'aria-describedby': 'message-id',
                            }}
                            message={<span id="message-id">Location has been added to your wishlist</span>}
                        />
                        }

                    </div>}
            </div>
        )
    }
}
SearchV3.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList,
    token: state.token.token,
    result: state.result.result
})
export default connect(mapStateToProps,{setWishList, getToken, getResults} )(withStyles(styles)(SearchV3));