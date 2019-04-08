import React from 'react';
import Menu from './Menu';
import Nav from './Nav';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

class Header extends React.Component {
    state = {
        top: false,
        left: false,
        bottom: false,
        right: false,

    };
    componentDidMount() {
        this.setState({
            left: false,
        });

    }
    toggleDrawer = (side, open) => () => {
        this.setState({
            [side]: open,
        });
    };
    render() {

        return (
            <div>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    className="drawer_wrapper"
                    onClick={this.toggleDrawer('left', true)}
                >
                    <MenuIcon />
                </IconButton>

                <header className="main-menu">

                            <Menu
                                open={this.state.left}
                                onClose={this.toggleDrawer('left', false)}
                                onOpen={this.toggleDrawer('left', true)}
                            />


                </header>
            </div>

        )
    }
}

export default Header;
