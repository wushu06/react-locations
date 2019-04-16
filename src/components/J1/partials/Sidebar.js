import React from 'react';
import {Grid, ListItem,ListItemText } from '@material-ui/core'

class Sidebar extends React.Component {
    state = {

    }

    componentDidMount(){
        console.log(this.props.filter);
    }


    displayFilter = () => {
        return this.props.filter.map((res, i)=> {
            let pair = {
                filter: res.filter,
                name: res.name
            }
            return(
                <div key={i} style={{width: '100%'}} className={this.isObjectContains(this.props.oldSearch,res.filter )}>
                    <ListItem button className="input display_filter" >
                        <ListItemText data-tag={res} className="autoComplete_item" inset primary={res.name +' ('+res.count+')'} secondary={res.filter} onClick={this.props.manualSearchAutComplete.bind(null, res.filter, pair, false)}/>

                    </ListItem>
                    {
                        (res.index >= 21 &&  !this.props.hideFilterMore  ) &&  ( <ListItem button className="input see_more_filter">
                            <ListItemText data-tag={res} className="autoComplete_item" inset primary={'See ' + this.props.filterResult+' more'}/>
                        </ListItem>)
                    }
                </div>

            )
        })
    }

    isObjectContains = (obj, val) => {
        return obj.map(f => { if(f.filter === val){return ('disabled filter_btn')}else{return ('')}})
    }

    render() {
        return(
            <Grid item md={12} xs={12}>
                <div className="filter_wrapper">
                    <div><h2>Related</h2>{this.displayFilter()}</div>
                </div>
            </Grid>
        )
    }
}

export default Sidebar;