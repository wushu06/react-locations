import React from 'react';
import {Link} from 'react-router-dom'
import Header from '../../../containers/Header';
import {Button, AppBar, Fab, Icon,Divider, Toolbar, Checkbox,ListItemText,Snackbar,FormControlLabel, ListItem, Badge, List, Typography,CircularProgress, IconButton, InputBase, Grid} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SortIcon from '@material-ui/icons/SortByAlpha';
import Search from '@material-ui/icons/SearchOutlined'
import Spinner from '../../../containers/UI/Spinner'
import Single from '../Single';
import Wishlist from '../partials/Wishlist';
import axios from 'axios';
import $ from 'jquery'
import {TweenMax} from "gsap/TweenMax";
import Favorite from '@material-ui/icons/Favorite';
import {setWishList} from '../../../actions';
import { connect} from 'react-redux';
import  { easing, tween } from  'popmotion'
import posed from "react-pose";
import Cookie from '../../../lib/Cookie'


let cookie = new Cookie();
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

class SearchV2 extends React.Component {
    state = {
        loading: true,
        search: '',
        result: [],
        resultAutoComplete: [],
        filter: [],
        locations: [],
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
        oldSearch: '',
        numberOfResult: '',
        searchAll: false,
        sort: false,
        showSnackBar: false,
    }

    componentDidMount() {
        setTimeout(console.log.bind(console, "%c Collective Location by The Bigger Boat ⚓️ %c", "background: #f50057;color:#fff;padding:5px;border-radius: 5px;line-height: 26px;", ""));

        /*execute a function presses a key on the keyboard:*/
        var inp = document.getElementById("myInput")
        let _self = this
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById( "Input");
            if (x) x = x.getElementsByTagName("div");

            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/

                currentFocus++;
                /*and and make the current item more visible:*/

                _self.addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                _self.addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });

        // checking if there is a cookie or not to show the Heart icon
        let wishListCookie= cookie.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            this.props.setWishList(JSON.parse(wishListCookie))
        }


        $(document).on('click', '.add_to', function () {
            TweenMax.to($(this).parents('.result_list'), 1, {
                border: '1px solid #f50057',

            });
        })

        // set locations results state
        let searchURL = "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";
        // Make a request for a user with a given ID

        axios.get(searchURL)
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

    handleChange = event => {
        this.setState({search: event.target.value})
        this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search)})

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
        num = 6;
        this.setState({loading: true, numberOfResult: ''},()=>{
            let res = this.searchTerm(this.state.search)
            if (res.length > 0) {
                this.setState({loading: false, single: '', result: res,  noResult: false,  showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true,numberOfResult: '', showMe: true, sort: false});
            }
        })

    }

    manualSearchAutComplete = (e, res) => {
        num = 6;
        this.setState({loading: true,   filter: []},()=>{
            let res = this.searchTerm(this.state.search, e)

            if (res.length > 0) {
                this.setState({loading: false, single: '', result: res,  noResult: false, resultAutoComplete: [], search: '',oldSearch:e, showMe: true, sort: false})
            } else {
                this.setState({loading: false, single: '', result: [],  noResult: true, resultAutoComplete: [], search: '', oldSearch:e, numberOfResult: '', showMe: true, sort: false});
            }
        })

    }
    searchAutoComplete = (val) => {
        const regex = new RegExp(val, "i");
        let result = []
        let filter = []

        this.state.locations.map((item, index) => {
            if ( regex.test(item.category_path_names) ) {
                if (  filter.indexOf(item.category_path_names) === -1) {

                    filter.push(item.category_path_names)
                }
            }

        })

        let counts = {};
        filter.forEach(function(x) {
            counts[x] = (counts[x] || 0)+1;
        });


        return filter;
    }
    searchAutoCompleteDisplay = () => {

        let resultAutoComplete = this.state.resultAutoComplete
        return resultAutoComplete.length > 0 && resultAutoComplete.map((res, i) => {
            return (
                <ListItem button className="input" key={i}>
                    <ListItemText data-tag={res} className="autoComplete_item" inset primary={res}  onClick={ this.manualSearchAutComplete.bind(null, res)}/>
                </ListItem>
            )
        })
    }
    deleteSearchTerm = () => {
        this.setState({loading: false, single: '', result: [], filter:  [], noResult: false, resultAutoComplete: [], search: '',oldSearch:'', numberOfResult: '', showMe: true, sort: false})
    }
    searchTerm = (val, cat = '') => {


        const regex = new RegExp(cat, "i");
        const regexAll = new RegExp(val, "i");
        let result = []
        this.setState({loading: true})
        let dupCheck = []

        this.state.locations.map((item, index) => {
            //            SELECT distinct j1_document.id,
            // j1_location.name as location_title,
            // j1_document.category_id,
            // j1_location_category.name as category_name,
            // j1_location_category.parent_category_path_names,
            // j1_document.title,
            // j1_document.mime_type,
            //  j1_document.sub_folder,
            // j1_document.file_name,
            // j1_location.name

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
                        //   if (result.indexOf(item.category_path_names) === -1) {
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
                        //  }


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

        this.setState({ numberOfResult: result.length })


        return result;
    }

    showMore = () => {
        return this.setState({showMe: false})
    }


    addToWishlist = (id, path) => {
        let arr = this.props.wishList
        arr.push({ id: id,image: path})
        this.props.setWishList(arr)
        cookie.checkCookie(this.props.wishList)
        return this.setState({wishListArray:arr, update: id, showSnackBar: true})

    }
    showWishlist = () => {
        return this.setState(prevState => ({
            showList: !prevState.showList
        }));
    }


    loadSingle = (id, path) => {
        return this.setState({single: id, path: path,showMe:false})
    }

    handleCheckChange = name => event => {
        this.setState({[name]: event.target.checked});
    };

    displayResult = (result, num = 6) => {
        if(this.state.sort && result.length > 0) {

            this.sortArray(result, 'loc_title', false)
        }

        return result.length > 0 && result.map((name, i) => {
            while (i < num) {
                let path = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img
                return (<div className="result_list" key={i} id={name.loc_id}>
                    <Button onClick={() => this.loadSingle(name.loc_id, path)} style={{display: 'block'}}>
                        <img width="290" src={path}/>
                        <h4><strong>{name.loc_title}</strong>  </h4>
                        {name.exclusive === '0' ?  '' : (<Icon>star_icon </Icon>) }
                    </Button>

                    <span className="wisth_btn">
                        <span   >
                            <Favorite onClick={()=>this.addToWishlist(name.loc_id, path)} />
                        </span>

                    </span>

                </div>)
            }
        })
    }


    addActive = (x) => {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        this.removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);


        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    removeActive = (x) => {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
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

        div = this.displayResult(this.state.result)
        this.setState(prevState => ({
            sort: !prevState.sort
        }));


    }
    handleClose = () => {
        this.setState({ showSnackBar: false });
    }

    render() {

        const {search, result, loading, single,showSnackBar,  noResult,  showList, wishListArray, resultAutoComplete, oldSearch,numberOfResult, searchAll} = this.state
        const {classes} = this.props;

        if (result.length > 0) {
            div = this.displayResult(result)

        }else{
            div = ''
        }

        if (!this.state.showMe) {
            num += 6
            div = this.displayResult(result, num)
        }
        return (
            <div>
                <Header/>
                <div className="container_wrapper">
                    <AppBar position="fixed" className='search-header'>
                        <Toolbar className="toolbar">
                            {oldSearch && !searchAll && <div className="old_search">
                                <div><span>{oldSearch} </span><Icon onClick={()=> this.deleteSearchTerm()}>cancel_icon</Icon></div>

                            </div>}
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
                                <div className="versions">
                                    <span><Link to="/">Current version </Link></span>
                                    <span><Link to="/v1">V1 </Link></span>
                                    <span><Link to="/v3">V3 </Link></span>
                                </div>
                                {(showList && this.props.wishList.length > 0) ?
                                    <ShowList
                                        onClick={() => this.setState(prevState => ({clicking: !prevState.clicking  }))}
                                        pose={this.state.clicking2 ? "cliked1" : "uncliked2"}
                                    >
                                        <div className="wish_container"><Wishlist array={wishListArray}  update={this.state.update}/></div>
                                    </ShowList> : ''}
                                {single && <Single id={single} image={this.state.path}/>}
                                {numberOfResult && (<div className="result_total">
                                    <span>Results:<span className="fig"> { numberOfResult } </span> </span>
                                    <span onClick={()=>this.sortResult()}>
                                            <SortIcon/>
                                        </span>
                                </div>)}
                                <List className={loading ? 'loading result' : 'result'}>
                                    {noResult ? <h2>No result!</h2> : ''}
                                    {div}
                                </List>

                                <div className="show_more">
                                    {numberOfResult && ((numberOfResult - num)   > 0 ) ?
                                        <Button variant="contained" color="secondary" onClick={() => this.showMore()}>See <span className="number">{(numberOfResult - num ) } </span>more </Button> : ''}
                                </div>
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

                </div>
            </div>
        )
    }
}
SearchV2.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList
})
export default connect(mapStateToProps,{setWishList} )(withStyles(styles)(SearchV2));