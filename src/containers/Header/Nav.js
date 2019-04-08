import React, { Component } from 'react';
import {Link} from 'react-router-dom'


const style = {
    display: 'inline-block',
    margin: '16px 32px 16px 0',
    width: '200px'
};

class WpMenu extends Component {
    constructor() {
        super();
        this.state = {
            menus:[],
        }
    }
    componentDidMount() {
        let menuURL = "http://192.168.1.135:8888/gutenberg/wp-json/wp-menus/v1/menus/main-menu";

        fetch(menuURL)
            .then(res => res.json())
            .then(res => {

                this.setState({
                    menus: res
                })

            })

    }
     RemoveLastDirectoryPartOf = (the_url) =>
    {
        let the_arr = the_url.split('/');
        the_arr.pop();
        return( the_arr.join('/') );
    }


    render() {

        const stateMenu = this.state.menus

        const menu = Object.keys( stateMenu ).map( igKey => {
            console.log(stateMenu[igKey])
            const item = stateMenu[igKey]

            if(item ){
                return (
                    <div>
                        <Link to={(item.url).substring(0, (item.url).lastIndexOf('/'))}>{item.title}</Link>
                    </div>
                )

            }

        } );






        return (
            <div>
                {menu}
            </div>


        )
    }

}
export default WpMenu;