import React from 'react';
import {Link} from 'react-router-dom'
import {Button, AppBar, Fab, Icon,Divider, Toolbar, Checkbox,Badge, List, Typography,CircularProgress, IconButton, InputBase, Grid} from '@material-ui/core'
import Tabletop from 'tabletop'


class Sheet extends React.Component {
    state = {
        data : [],
        check : true
    }
    componentDidMount() {

        this.init()
    }

     init = () => {
        let _self = this
        Tabletop.init( { key: 'https://docs.google.com/spreadsheets/d/17uW_t3ERzb533YQTXn90tV_KuwsYoFF2CnM_gtqtUFQ/edit?usp=sharing',
            callback: function(data, tabletop) {
            if(_self.state.check){
                _self.setState({data: data})
            }

            },
            simpleSheet: true } )
         let data = this.state.data
         return data.length > 0 && data.map(res => (
             <Grid item sm={4} xs={6}>
                 <img src="http://via.placeholder.com/200x200" alt=""/>
                 <h2>{res.Property_name} <br/>{res.Estate_Name}</h2>
                 <p>{res.Address}</p>
             </Grid>
         ))
    }

    render() {

        return (
            <div>
                <Grid container spacing={24}>
                    {this.init()}

                </Grid>
            </div>
        )
    }
}

export default Sheet;