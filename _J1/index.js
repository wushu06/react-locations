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
import {setWishList, getToken} from '../../actions';
import { connect} from 'react-redux';
import  { easing, tween } from  'popmotion'
import posed from "react-pose";

import Slider from "react-slick";
import MapJ1 from './MapJ1';
import DisplayResult from './displayResult';

//import AutoComplete from './AutoComplete';



let currentFocus = -1
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
        submitSearchTerm: ''
    }

    componentDidMount() {

        setTimeout(console.log.bind(console, "%c Collective Location by The Bigger Boat ⚓️ %c", "background: #f50057;color:#fff;padding:5px;border-radius: 5px;line-height: 26px;", ""));
        document.getElementById('myInput').addEventListener("keydown", this.handleKeyDown )
        document.addEventListener("click", this.closeAllLists);
        this.startTime = Date.now();
        let _self = this
        let searchURL = "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";
        let categories = "http://phpstack-214959-744649.cloudwaysapps.com/categoyJson.php";
        // Make a request for a user with a given ID
        axios.get(searchURL)
            .then(function (response) {
                _self.setState({
                    locations: response.data,
                    loading: false
                })

            })
            .then(()=>{
                axios.get(categories)
                    .then(function (response) {
                        _self.setState({
                            categories: response.data,
                        })

                    })
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })


    }

    componentWillUpdate(){
        this.endTime = Date.now();
    }

    handleChange = event => {
        this.setState({search: event.target.value})
        this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search), filter: this.searchAutoComplete(this.state.search)})
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
        console.log('subm');
        event.preventDefault()
       // this.manualSearch()

        let res = this.state.submitSearchTerm
        let pair = {
            filter: res,
            name: this.state.search
        }

        this.setState({loading: true,   showFilter: true},()=>{
            let result = this.searchTerm(this.state.search, res)
            if (result.length > 0) {
                this.setState({loading: false, single: '', result: result,  noResult: false, resultAutoComplete: [], search: '',oldSearch:[pair, ...this.state.oldSearch], showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true, resultAutoComplete: [], search: '', oldSearch:[pair, ...this.state.oldSearch], numberOfResult: '', showMe: true, sort: false});
            }
        })

    }

    // handle the manual search if the option for it is ticked
    manualSearch = () => {
        this.startTime = Date.now();
        num = 6;
        this.state.search.length > 1 &&
        this.setState({loading: true, numberOfResult: ''},()=>{
            let res = this.searchTerm(this.state.search)
            if (res.length > 0) {
                this.setState({loading: false, single: '', result: res,  noResult: false,  showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true,numberOfResult: '', showMe: true, sort: false});
            }
        })

    }

    manualSearchAutComplete = ( res, pair, e) => {
        console.log('clcik');
        this.startTime = Date.now();
        num = 6;
        this.setState({loading: true,   showFilter: true},()=>{
            let result = this.searchTerm(this.state.search, res)
            if (result.length > 0) {
                this.setState({loading: false, single: '', result: result,  noResult: false, resultAutoComplete: [], search: '',oldSearch:[pair, ...this.state.oldSearch], showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true, resultAutoComplete: [], search: '', oldSearch:[pair, ...this.state.oldSearch], numberOfResult: '', showMe: true, sort: false});
            }
        })
    }

    searchAutoComplete = (val, limit = true) => {
        const regex = new RegExp(val, "i");
        let result = []
        let filter = []
        let filterfake = []
        let filterfake2 = []
        let suggestions = []
        let i = 0;
        this.state.categories.map((item, index) => {
            if ( regex.test(item.category_path_names) ) {
                if (filterfake2.indexOf(item.category_path_names) === -1) {
                    filterfake2.push(item.category_path_names)
                }

                if (filterfake.indexOf(item.category_path_names) === -1) {
                    filterfake.push(item.category_path_names)

                    if(filterfake.length > 21 && limit ) {
                        return;
                    }
                    filter.push({filter: item.category_path_names, name: item.name, count: item.name_count, index: filterfake2.length})


                }

            }

        })
        this.setState({
            filterResult: filterfake2.length
        })

        let counts = {};
        filter.forEach(function(x) {
            counts[x] = (counts[x] || 0)+1;
        });
        return filter;
    }

    searchAutoCompleteDisplay = () => {
        let resultAutoComplete = this.state.resultAutoComplete
        let autCompCheck = []
        return resultAutoComplete.length > 0 && resultAutoComplete.map((res, i) => {
            let pair = {
                filter: res.filter,
                name: res.name
            }
            return (
                <div key={i} style={{width: '100%'}} className="autoComplete_child">
                    <ListItem button className="input" data-search={res.name} data-filter={res.filter}>
                        <ListItemText  className="autoComplete_item" inset primary={res.name +' ('+res.count+')'} secondary={res.filter} onClick={this.manualSearchAutComplete.bind(null, res.filter, pair)}/>

                    </ListItem>
                    {
                        (res.index >= 21 &&  !this.state.hideFilterMore  ) &&  ( <ListItem button className="input see_more_filter">
                            <ListItemText  className="autoComplete_item" inset primary={'See ' + this.state.filterResult+' more'} onClick={this.increaseFilter}/>
                        </ListItem>)
                    }
                </div>
            )
        })
    }

    increaseFilter = () => {
        //  this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search, false), filter: this.searchAutoComplete(this.state.search)})
        this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search, false),filter: this.searchAutoComplete(this.state.search , false) , hideFilterMore: true})
    }

    increaseFilter2 = () => {
        //  this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search, false), filter: this.searchAutoComplete(this.state.search)})
        this.setState({single: '', resultAutoComplete: [],filter: this.searchAutoComplete(this.state.search , false) , hideFilterMore: true})
    }

    deleteSearchTerm = (i, filter) => {
        this.searchAutoComplete(filter)
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
    searchTerm = (val, cat = '') => {


        const regex = new RegExp(cat, "i");
        const regexAll = new RegExp(val, "i");
        let result = [...this.state.result]
        this.setState({loading: true})
        let dupCheck = [...this.state.dupCheck];
        let cord = []


        this.state.locations.map((item, index) => {
            if (!this.state.searchAll ) {
                if (this.state.exclusive) {
                    if (regex.test(item.category_path_names)) {
                        // if (result.indexOf(item.category_path_names) === -1) {
                        if( item.exclusive!== '0' ) {
                            result.push({
                                id: item.id,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name + ' > ' + item.parent_category_path_names,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                category_path_names: item.category_path_names,
                                exclusive: item.exclusive
                            })
                        }
                        //  }


                    }
                }else{
                    if (regex.test(item.category_path_names)) {
                        let name = item.name;


                        if (dupCheck.indexOf(name) === -1) {
                            result.unshift({
                                id: item.id,
                                check: name,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name + ' > ' + item.parent_category_path_names,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                category_path_names: item.category_path_names,
                                exclusive: item.exclusive,
                                postcode: item.postcode,
                                lat: item.latitude,
                                lng: item.longitude,
                                commercial: item.commercial,
                                residential: item.residential,
                                production: item.production,
                                all: '1'
                            })
                             cord.push({
                                     name: name,
                                     postcode: item.postcode,
                                     lat: item.latitude,
                                     lng: item.longitude

                             })

                        } else {
                            result.map(function (obj, i) {

                                if (obj.check === name) {
                                    Object.keys(obj).indexOf('img2') === -1 ? obj['img2'] = item.file_name : obj['img3'] = item.file_name

                                }
                            });
                        }


                        dupCheck.push(name)

                    }
                }
            }else{
                if (this.state.exclusive) {
                    if (regexAll.test(item.location_title)) {
                        if (result.indexOf(item.location_title) === -1) {
                            if( item.exclusive!== '0' ) {
                                result.push({
                                    id: item.id,
                                    loc_title: item.location_title,
                                    loc_id: item.location_id,
                                    img: item.file_name,
                                    name: item.name,
                                    mime: item.mime,
                                    category_name: item.category_name,
                                    category_parent: item.parent_category_path_names,
                                    exclusive: item.exclusive
                                })
                            }
                            dupCheck.push(item.location_title)
                        }

                    }
                }else{
                    if (regexAll.test(item.location_title)) {

                        if (dupCheck.indexOf(item.location_title) === -1) {
                            result.push({
                                id: item.id,
                                loc_title: item.location_title,
                                loc_id: item.location_id,
                                img: item.file_name,
                                name: item.name,
                                mime: item.mime,
                                category_name: item.category_name,
                                category_parent: item.parent_category_path_names,
                                exclusive: item.exclusive
                            })

                            dupCheck.push(item.location_title)

                        }

                    }
                }
            }

        });
       // numberOfResult: result.length, got replaced with the displayresult one
        this.setState({ numberOfResult: result.length, dupCheck, cord: cord })


        return result;
    }

    showMore = () => {
      //  return this.setState({showMe: false})
        num += 6
        // div = this.displayResult(result, num)
        div = <DisplayResult
            result={this.state.result}
            num={num}
            select={this.state.typeName}
            sort={this.state.sort}
            getResultsData={this.getResultsData}
            getSingleData={this.getSingleData}
            getResultTotal={this.getResultTotal}
        />
    }


    showWishlist = () => {
        return this.setState(prevState => ({
            showList: !prevState.showList
        }));
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
        this.setState({search:document.querySelectorAll('.autocomplete-active')[0].childNodes[0].dataset.search,
                        submitSearchTerm:document.querySelectorAll('.autocomplete-active')[0].childNodes[0].dataset.filter
        })

    }
   removeActive = (x) => {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
   }

    closeAllLists = (elmnt) => {
        this.setState({
            resultAutoComplete: []
        })
        let filter = this.state.submitSearchTerm
        let pair = {
            filter: filter,
            name: this.state.search
        }
        this.manualSearchAutComplete.bind(null, filter, pair)
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
    sortResult = () => {
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

        }

        if(this.state.typeName){
           // div = this.displayResult(this.state.result, num, this.state.typeName)
            div = <DisplayResult
                result={this.state.result}
                num={num}
                select={this.state.typeName}
                sort={this.state.sort}
                getResultsData={this.getResultsData}
                getSingleData={this.getSingleData}
                getResultTotal={this.getResultTotal}
            />
        }
        return (
            <div>
                {this.state.single ? <Single  token={this.props.token} id={this.state.single} /> : (

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
                                        {resultAutoComplete && !searchAll && <div className="autoComplete">
                                            <List id="Input">
                                                {this.searchAutoCompleteDisplay()}
                                            </List>
                                        </div>}

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
                                    <div className="loading_time">
                                        <Icon>timer_icon</Icon> <p>{loadingTime} s</p>
                                    </div>
                                    {(showList && this.props.wishList.length > 0) ?
                                        <ShowList
                                            onClick={() => this.setState(prevState => ({clicking: !prevState.clicking  }))}
                                            pose={this.state.clicking2 ? "cliked1" : "uncliked2"}
                                        >
                                            <div className="wish_container"><Wishlist array={wishListArray}  update={this.state.update}/></div>
                                        </ShowList> : ''}

                                    {numberOfResult > 0 && (<div className="result_total">
                                        <div className="sort_filter">
                                            <span>Results:<span className="fig"> { numberOfResult } </span> </span>
                                                <span onClick={()=>this.sortResult()}>
                                                <SortIcon/>
                                            </span>
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


                                    </div>)}
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
                                       {/* <Grid item md={12} xs={12}>*/}
                                            {/*<div className="google_map">*/}
                                                {/*(cord.length > 0 && oldSearch.length > 0) && <MapJ1 cord={cord} zoom={zoom} centerLat={cord[0].lat} centerLng={cord[0].lng}   />*/ }
                                          {/*  </div>*/}
                                      {/*  </Grid>*/}
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
                            message={<span id="message-id">Location has been added to your wish list</span>}
                        />
                        }

                    </div>) }
            </div>
        )
    }
}
SearchV3.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList,
    token: state.token.token
})
export default connect(mapStateToProps,{setWishList, getToken} )(withStyles(styles)(SearchV3));