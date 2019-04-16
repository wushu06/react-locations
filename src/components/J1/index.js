import React from 'react';
import ReactDOM from 'react-dom';
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
import Wishlist from './partials/Wishlist';
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
import MapJ1 from './partials/MapJ1';
import DisplayResult from './partials/displayResult';
import AutoCompleteDiaplay from './partials/AutoCompleteDisplay';
import SearchInit from '../../lib/SearchInit'
import Sidebar from './partials/Sidebar';
import AutoComplete from '../../lib/AutoComplete'





const searchInit = new SearchInit();
const autoCompleteLib = new AutoComplete();
const cookie = new Cookie();
let currentFocus = -1;
let resultTotal;
let once = true;
let div = '';
let num = 6;

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
        single: '',
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
        clicking: false,
        cliked1: false,
        oldSearch: [],
        numberOfResult: '',
        searchAll: false,
        length: 21,
        sort: false,
        zoom: 6,
        dataSearch: ''
    }

    componentWillMount(){
        this.props.getResults();
    }
    componentDidUpdate(){

    }

    componentDidMount() {

        setTimeout(console.log.bind(console, "%c Collective Location by The Bigger Boat ⚓️ %c", "background: #f50057;color:#fff;padding:5px;border-radius: 5px;line-height: 26px;", ""));
        let wishListCookie= cookie.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            this.props.setWishList(JSON.parse(wishListCookie))
            this.props.getToken()
        }


        document.getElementById('myInput').addEventListener("keydown", this.handleKeyDown )
        document.addEventListener("click", this.closeAllLists.bind((this)));
        this.startTime = Date.now();
        let _self = this
        let searchURL = "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";
        let categories = "http://phpstack-214959-744649.cloudwaysapps.com/categoyJson.php";
        document.addEventListener('click', this.handleClickOutside, true);
        let self = this;


      (this.props.getResults().payload.result).then(function (value) {
            self.setState({
                loading: false,
                locations: value[0].data,
                categories: value[1].data,
            })
        });


    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = event => {


        if (this.node && this.node.contains(event.target)) {
            return;
        }else{
            this.setState({
                showList: false
            });
        }
    }



    handleChange = event => {
        this.setState({search: event.target.value})
        this.setState({
            single: '',
            resultAutoComplete: autoCompleteLib.searchAutoComplete(this.state.search, this.state.categories).filter,
            filter: autoCompleteLib.searchAutoComplete(this.state.search,this.state.categories).filter
        })

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
        if(this.state.searchAll){
            this.manualSearch();
            return;
        }
        if(this.state.search.length < 1 || !this.state.dataSearch){
            return;
        }

        let res = this.state.dataSearch
        let pair = {
            filter: this.state.dataFilter,
            name: this.state.dataSearch
        }
        this.manualSearchAutComplete( res, pair, this.state.searchAll, event);

    }

    // handle the manual search if the option for it is ticked
    manualSearch = () => {
        let pair = {
            filter: this.state.search,
            name: this.state.search
        }
        this.manualSearchAutComplete( this.state.search, pair,this.state.searchAll, null);
    }

    manualSearchAutComplete = ( res, pair,searchAll = false, e) => {

        this.setState({loading: true,   showFilter: true},()=>{
            // let result = this.searchTerm(this.state.search, res)
            let getResult = searchInit.searchTerm(this.state.search, res,this.state.locations,searchAll, this.state.exclusive, this.state.result, this.state.dupCheck)
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
       // this.searchAutoComplete(filter)
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




    showWishlist = () => {
        return this.setState(prevState => ({
            showList: !prevState.showList
        }));
    }

    loadSingle = (id, path) => {
        return this.setState({single: id,showMe:false})
    }

    /*
     * add active class
     */

    handleKeyDown = (e) => {


            let x = document.getElementById("Input");
            if (x) x = x.querySelectorAll(".autoComplete_child");

            if (e.keyCode == 40) {
                currentFocus++;
                this.addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                this.addActive(x);
            }


    }
   addActive = (x) => {
        if (!x) return false;
        this.removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
        let dataSearch = $(x[currentFocus]).find('.input').data('search');
        let dataFilter = $(x[currentFocus]).find('.input').data('filter');
        this.setState({ //search:document.querySelectorAll('.autocomplete-active')[0].childNodes[0].dataset.search,
                        dataSearch:dataSearch,
                        dataFilter: dataFilter
        })

    }
   removeActive = (x) => {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
   }

    closeAllLists = (elmnt) => {
        if(this.state.searchAll){
            return;
        }
        if(elmnt.path[2].tagName !== 'FORM' && !elmnt.target.className.includes('see_more')  ){
            this.setState({
                search: ''
            })
        }

    }

    handleCheckChange = name => event => {
        console.log('clik');
        console.log(event.target.checked);
        this.setState({[name]: !event.target.checked});
    };

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


    // from child
    getResultsData = (data) => {

        this.setState({wishListArray:data.wishListArray, update: data.update, showSnackBar: data.showSnackBar})

    }
    getSingleData = (data) => {
        return this.setState({single:data.single, showMe: data.showMe})
    }
    getResultTotal = (total) => {
        return this.setState({numberOfResult: total})
    }
   /* sortResult = () => {
       // div = this.displayResult(this.state.result,num, this.state.typeName)
        div = <DisplayResult
                    result={this.state.result}
                    num={num}
                    select={this.state.typeName}
                    sort={this.state.sort}
                    getResultsData={this.getResultsData}
                    getSingleData={this.getSingleData}
                    getResultTotal={this.getResultTotal}
                />
        this.setState(prevState => ({
            sort: !prevState.sort
        }));


    }*/
    handleClose = () => {
        this.setState({ showSnackBar: false });
    }
    collapse = () =>{
        alert('blue')
        this.setState({showList: false});
    }

    render() {

        const {search, result, loading, single,showSnackBar,exclusive,  noResult,  showList, wishListArray, resultAutoComplete, oldSearch,numberOfResult, searchAll, showFilter, cord, zoom} = this.state
        const {classes} = this.props;


        if (result.length > 0) {
            div = <DisplayResult
                    result={this.state.result}

                  />
        }else{
            div = ''
        }

        return (
            <div>

                    <div className="container_wrapper">
                        <Header/>
                        <AppBar position="fixed" className='search-header'>
                            <Toolbar className="toolbar">

                                <div className={classes.search}>

                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>

                                    <form onSubmit={ this.handleSubmit }>
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
                                        {!searchAll &&  <AutoCompleteDiaplay search={this.state.search} categories={this.state.categories} manualSearchAutComplete={this.manualSearchAutComplete} />}

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

                                                onClick={this.handleCheckChange('exclusive')}
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
                                                onClick={this.handleCheckChange('searchAll')}
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
                                            <Fab className="wish_btn" color="secondary" aria-label="Edit" size="small" onClick={() => this.showWishlist()}>
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
                                        {oldSearch  &&
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
                                        <span><Link to="/v1">V1 </Link></span>
                                        <span><Link to="/v2">V2 </Link></span>
                                        <span><Link to="/v3">V3 </Link></span>
                                    </div>

                                    {(showList && this.props.wishList.length > 0) ?
                                        <ShowList
                                            onClick={() => this.setState(prevState => ({clicking: !prevState.clicking  }))}
                                            pose={this.state.clicking2 ? "cliked1" : "uncliked2"}
                                        >
                                            <div ref={node =>  this.node = node } className="wish_container"><Wishlist  array={wishListArray}  update={this.state.update}/></div>
                                        </ShowList> : ''}

                                    <List className={loading ? 'loading result' : 'main_wrapper'}>
                                        {noResult ? <h2></h2> : ''}
                                        {div}
                                    </List>
                                </Grid>
                                <Grid item md={4} xs={4}>
                                    <Grid container spacing={24} className="main">
                                        {(showFilter && oldSearch.length > 0) &&
                                             <Sidebar
                                                 filter={this.state.filter}
                                                 filterResult={this.state.filterResult}
                                                 hideFilterMore={this.state.hideFilterMore}
                                                 oldSearch={this.state.oldSearch}
                                                 manualSearchAutComplete={this.manualSearchAutComplete}
                                             />
                                        }
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
                            message={<span id="message-id">Location has been added to your wish list</span>}
                        />
                        }

                    </div>
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