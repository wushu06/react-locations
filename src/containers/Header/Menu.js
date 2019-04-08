import React from 'react';
import {Link} from 'react-router-dom'
import {Divider, Button, AppBar, SwipeableDrawer, List, ListItemIcon, Collapse, ListItem, ListItemText} from '@material-ui/core'
import logo from '../../logo.svg';
import axios from 'axios'
import {BrowserRouter, Route} from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

import {NavLink} from 'react-router-dom';

class Menu extends React.Component {
    state = {
        menus: [],
        top: false,
        left: true,
        bottom: false,
        right: false,
        open: true,

    };
    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };

    componentDidMount() {

        let menuURL = process.env.REACT_APP_SITE_URL + '/wp-json/wp/v2/menus/2';

        fetch(menuURL)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    menus: res.data.items
                }, () => this.displayMenu())

            })
    }

    displayMenu = () => {
        let pathName = window.location.pathname;
        let path = window.location.pathname;
        let page = path.split("/").pop();

        return this.state.menus.map(item => {

            if (item.children && item.children.length > 0) {

                return ( <div key={item.id} className="collapse">

                            <ListItem button >
                                <Link className={pathName === '/' + item.object_slug ? 'active' : ''} to={'/' + item.object_slug}>
                                    <ListItemText primary={item.title}/>
                                </Link>
                                {this.state[item.id]? <ExpandLess  onClick={() => this.handleClick(item.id)}/> : <ExpandMore  onClick={() => this.handleClick(item.id)} />}

                            </ListItem>
                                        <Collapse in={this.state[item.id]} timeout="auto" unmountOnExit >

                            {(item.children && item.children.length > 0) && item.children.map(child => {
                                return (
                                    <List component="div" disablePadding key={child.id}>


                                            <ListItem >
                                            <Link className={page ===  child.object_slug ? 'active' : ''} to={'/' + item.object_slug + '/' + child.object_slug}>
                                                <span>{child.title} </span>
                                            </Link>
                                            </ListItem>
                                    </List>






                                )
                            })

                        }
                            </Collapse>
                    </div>)
            } else {
                return ( <ListItem button key={item.id}>
                            <Link className={pathName === '/' + item.object_slug ? 'active' : ''} to={'/' + item.object_slug}>
                                <ListItemText primary={item.title}/>
                            </Link>
                        </ListItem>)
            }

        })
    }

    handleClick = (id) => {
        this.setState(state => ({[id]: !state[id]}));
    };

    render() {

        return (
            <SwipeableDrawer
                className="swip_drawer"
                open={this.props.open}
                onClose={this.props.onClose}
                onOpen={this.props.onOpen}
            >
                {/*<div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer('left', false)}
                    onKeyDown={this.toggleDrawer('left', false)}
                >*/}


                <List className="menu_list">
                    <ListItem button>
                        <Link to='/'><img src={logo} className="App-logo" alt="logo" width="100"/></Link>
                    </ListItem>

                    {this.state.menus.length > 0 && this.displayMenu()}


                </List>

                {/*</div>*/}
            </SwipeableDrawer>
        )
    }
}

export default Menu;