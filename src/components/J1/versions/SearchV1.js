import React from 'react';
import {Link} from 'react-router-dom'
import {Button, AppBar, Fab, Icon,Divider, Toolbar, Checkbox,Badge, List, Typography,CircularProgress, IconButton, InputBase, Grid} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import {fade} from '@material-ui/core/styles/colorManipulator';
import {withStyles} from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
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
let count = 0
let num = 6;
class SearchV1 extends React.Component {
    state = {
        posts: [],
        postName: [],
        loading: true,
        store_category: [],
        type: [],
        terms: [],
        search: '',
        result: [],
        filter: [],
        taxResult: [],
        termName: [],
        acf: {},
        category: [],
        categories: [],
        locations: [],
        count: '',
        showMe: true,
        num: 0,
        exact: false,
        checkedA: false,
        checkedB: false,
        showRest: false,
        circle: true,
        noResult: false,
        oldId: '',
        wishListId: '',
        wishListIdPath: '',
        showList:false,
        wishListArray: [],
        update: ''
    }
    componentDidMount() {

        console.log(this.checkCookieOnLoad())
        let documentURL = "http://phpstack-214959-744649.cloudwaysapps.com/document.php";
        let categoryURL = "http://phpstack-214959-744649.cloudwaysapps.com/category.php";
        let categoriesURL = "http://phpstack-214959-744649.cloudwaysapps.com/categories.php";
        let locationURL = "http://phpstack-214959-744649.cloudwaysapps.com/location.php";
        let searchURL = "http://phpstack-214959-744649.cloudwaysapps.com/jsonv2.php";
        let acfURL = 'http://wordpress-222461-676549.cloudwaysapps.com/wp-json/acf/v3/wpsl_stores'
        /*fetch(categoryURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    category: res,
                    loading: true
                })
            })
        fetch(categoriesURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    categories: res,
                })
            })*/
        /*
                fetch(searchURL)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Bad response");
                        }
                        return response.json();
                    })
                    .then(data => this.setState({
                            locations: data,
                        }, () => this.setState({loading: false}))
                    )
                    .catch(error => console.error(error));*/

        // Make a request for a user with a given ID
        let _self = this
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
            .then(function () {
                _self.setState({ circle: false})
            });

    }

    componentDidUpdate () {
    }
    handleChange = event => {
        this.setState({search: event.target.value})
        if (this.state.checkedB) {
            if (event.target.value.length >= 3) {
                if (this.searchTerm(this.state.search, this.state.postName).length > 0) {
                    this.setState({single: '', result: this.searchTerm(this.state.search, this.state.posts)[0], filter:  this.searchTerm(this.state.search, this.state.posts)[1]})
                } else {
                    this.setState({result: [], single: '', showMe: true})
                }
            } else {
                this.setState({result: [], single: '', showMe: true})
                count = 0
            }
        }
    }
    isEmpty = (obj) => {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.manualSearch()
    }
    manualSearch = () => {
        this.setState({loading: true,  circle: true, filter: []},()=>{
            let res = this.searchTerm(this.state.search, this.state.posts, false)
            if (res[0].length > 0) {
                this.setState({loading: false, single: '', result: res[0], filter:  res[1], noResult: false})
            } else {
                this.setState({loading: false, single: '', result: [], filter: [], noResult: true});
            }
        })

    }
    searchTerm = (val, obj, check = false, cat = '') => {

        let arr = [];
        const regex = new RegExp(val, "i");
        const regexCAT = new RegExp(cat.replace(/[^a-zA-Z ]/g, ""), "gi");
        let result = []
        let filter = []
        this.setState({loading: true})
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

            if (check ) {
                //  if ((regex.test(item.name) || regex.test(item.parent_category_path_names))  && this.wordInString(item.category_name.replace(/[^a-zA-Z ]/g, ""), cat.replace(/[^a-zA-Z ]/g, ""))) {
                if ((regex.test(item.name) || regex.test(item.parent_category_path_names)  || regex.test(item.category_name))  && this.wordInString(item.category_name, cat)) {
                    if (result.indexOf(item) === -1) {
                        result.push({
                            id: item.id,
                            loc_title: item.location_title,
                            loc_id: item.location_id,
                            img: item.file_name,
                            name: item.name + ' > ' + item.parent_category_path_names,
                            mime: item.mime,
                            category_name: item.category_name,
                            category_parent: item.parent_category_path_names
                        })
                    }

                    filter.push(item.category_name)
                }
            } else {
                if ((item.name && regex.test(item.location_title)) || regex.test(item.parent_category_path_names) || regex.test(item.category_name)) {
                    //if (regex.test(item.location_title)) {

                    //  if( this.wordInString(item.name, val)){
                    //  if (result.indexOf(item) === -1) {
                    result.push({
                        id: item.id,
                        loc_title: item.location_title,
                        loc_id: item.location_id,
                        img: item.file_name,
                        name: item.name ,
                        mime: item.mime,
                        category_name: item.category_name,
                        category_parent: item.parent_category_path_names
                    })

                    //  }
                    filter.push(item.category_name)
                }

            }


        });
        this.setState({circle: false})
        let counts = {};
        filter.forEach(function(x) {
            counts[x] = (counts[x] || 0)+1;
        });

        return [result, counts]
    }
    wordInString = (s, word) => {
        if (new RegExp('\\b' + word + '\\b', 'gi').test(s)) {
            return true
        } else {
            return false
        }
    }
    showMore = () => {
        return this.setState({showMe: false})
    }
    displayResult = (result, num = 6) => {
        return result.length > 0 && result.map((name, i) => {

            if (i > 6) {
                count = i - 6;
            } else {
                count = i
            }
            while (i < num) {
                let path = "http://testj1.location-collective.co.uk/upload/location-photos/" + name.img
                return (<div className="result_list" key={i} id={name.loc_id}>
                    <Button onClick={() => this.loadSingle(name.loc_id, path)} style={{display: 'block'}}>
                        <img width="290" src={path}/>
                        <h4>j1_location > name : <strong>{name.name}</strong> </h4>
                        <Divider/>
                        <h4>j1_location_category > parent_category_path_names: <strong>{name.category_parent}</strong> </h4>
                        <Divider/>
                        <h4>j1_location_category > name: <strong>{name.category_name}</strong></h4>



                    </Button>
                    <Divider/>
                    <span className="wisth_btn">
                        <Fab color="secondary"  aria-label="Edit" size="small" onClick={()=>this.addToWishlist(name.loc_id, path)} >
                            <Favorite />
                        </Fab>

                    </span>

                </div>)
            }
        })
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

    checkCookieOnLoad = () => {
        let wishListCookie= this.getCookie("wishListCookie");
        if (wishListCookie !== "") {
            console.log();
            this.props.setWishList(JSON.parse(wishListCookie))

        }
    }
    checkCookie = () =>{
        let wishListCookie= this.getCookie("wishListCookie");

        wishListCookie = JSON.stringify(this.props.wishList);

        this.setCookie("wishListCookie", wishListCookie, 30);


    }
    addToWishlist = (id, path) => {
        // return this.setState({wishListId: id, wishListIdPath: path,showMe:false})
        let arr = this.props.wishList

        arr.push({ id: id,image: path})
        this.props.setWishList(arr)
        this.checkCookie()
        return this.setState({wishListArray:arr, update: id})

    }
    showWishlist = () => {

        return this.setState(prevState => ({
            showList: !prevState.showList
        }));
    }
    displayFilter = filter => {
        return Object.keys(filter).map((key, i)=> {
            return( <Button key={i}  disabled={this.state.showRest} onClick={()=> this.filterResult(key)}>
                {key} <span className="filter_count">( {filter[key]} ) </span>
            </Button>)

        });
    }
    filterResult = key => {
        console.log(key);
        let res = this.searchTerm(this.state.search, this.state.posts, true, key)
        this.setState({loading: false, single: '', result: res[0], filter: res[1], showRest: true})


    }
    resetResult = () => {
        this.setState({ showRest: false})
        let res = this.searchTerm(this.state.search, this.state.posts, false)
        this.setState({single: '', result: res[0], filter: res[1], showRest: false, loading: false})
    }
    loadSingle = (id, path) => {


        /*

                TweenMax.to(el, 1, {
                    scale: 1.1,
                    opacity:0.7


                });*/
        return this.setState({single: id, path: path,showMe:false})
    }
    handleCheckChange = name => event => {
        this.setState({[name]: event.target.checked});
    };
    render() {
        const {search, result, taxResult, loading, single, filter, showRest,  circle, noResult, wishListId, showList, wishListArray} = this.state
        const {classes} = this.props;
        if (result.length > 0) {
            div = this.displayResult(result)
        } else if (this.state.posts.length > 0) {
            div = ''
        } else {
            div = ''
        }
        if (!this.state.showMe) {
            num += 6
            div = this.displayResult(result, num)
        }
        return (
            <div>
                <div className="container_wrapper">

                    <AppBar position="fixed">
                        <Toolbar>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon/>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <InputBase
                                        placeholder="Search"
                                        onChange={this.handleChange}
                                        name="search"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                    />
                                    {circle && <CircularProgress color="secondary" className="loader"/>}
                                </form>
                            </div>
                            <div className="check-v1">
                                <Fab color="secondary" size="small" aria-label="Edit" className={classes.fab} onClick={() => this.manualSearch()}>
                                    <Search/>
                                </Fab>

                                {/*  <Typography>Search the exact word
                                    <Checkbox
                                        checked={this.state.checkedA}
                                        onChange={this.handleCheckChange('checkedA')}
                                        value="checkedA"
                                    />
                                </Typography>*/}
                                {/*<Typography>Show results while typing
                                    <Checkbox
                                        checked={this.state.checkedB}
                                        onChange={this.handleCheckChange('checkedB')}
                                        value="checkedA"
                                    />
                                </Typography>*/}
                            </div>
                            <div>
                                {this.props.wishList.length > 0 &&
                                <Badge  badgeContent={this.props.wishList.length} color="secondary">
                                    <Fab color="secondary" aria-label="Edit" size="small" onClick={() => this.showWishlist()}>
                                        <Favorite/>
                                    </Fab>
                                </Badge>
                                }
                            </div>
                        </Toolbar>
                    </AppBar>
                    <div className="container_wrapper_content">
                        <Grid container spacing={24} className="main">
                            <div className="versions">
                                <span><Link to="/">Current version </Link></span>
                                <span><Link to="/v2">V2 </Link></span>
                                <span><Link to="/v3">V2 </Link></span>
                            </div>
                            {loading && <Spinner/>}

                            <Grid item sm={9} xs={9}>
                                {(showList && this.props.wishList.length > 0) ? <div className="wish_container"><Wishlist array={wishListArray}  update={this.state.update}/></div> : ''}
                                {single && <Single id={single} image={this.state.path}/>}

                                <List className={loading ? 'loading result' : 'result'}>
                                    {noResult ? <h2>No result!</h2> : ''}
                                    {div}
                                </List>
                                <div className="show_more">
                                    {(count > 0 && num <= count && result.length > 0 ) ?
                                        <Button variant="contained" color="primary" onClick={() => this.showMore()}>See <span className="number"> {count - num} </span>more </Button> : ''}
                                </div>
                            </Grid>
                            {!this.isEmpty(this.state.filter) &&
                            <Grid item sm={3} xs={3} className="filter">
                                <div className="filter_wrapper">
                                    <div className="filter_content"><h4>j1_location_category > name </h4><Divider/> {this.displayFilter(filter)}</div>
                                    {showRest ? <Button variant="contained" color="primary" onClick={() => this.resetResult()}>Reset filter</Button> : '' }
                                </div>

                            </Grid>
                            }
                        </Grid>
                    </div>


                </div>
            </div>
        )
    }
}
SearchV1.propTypes = {
    classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
    wishList: state.setWishList.setWishList
})
export default connect(mapStateToProps,{setWishList} )(withStyles(styles)(SearchV1));