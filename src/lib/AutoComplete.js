import React, { Component, PropTypes } from "react";
import {ListItemText,ListItem, List} from '@material-ui/core'

class AutoComplete extends React.Component {
    state = {
        filter: [],
        filterResult: ''
    }
     searchAutoComplete = ( val, limit = true) =>{
        const regex = new RegExp(val, "i");
        let result = []
        let filter = []
        let filterfake = []
        let filterfake2 = []
        let suggestions = []
        let i = 0;
        this.props.categories.map((item, index) => {
            if (regex.test(item.category_path_names)) {
                if (filterfake2.indexOf(item.category_path_names) === -1) {
                    filterfake2.push(item.category_path_names)
                }

                if (filterfake.indexOf(item.category_path_names) === -1) {
                    filterfake.push(item.category_path_names)

                    if (filterfake.length > 21 && limit) {
                        return;
                    }
                    filter.push({
                        filter: item.category_path_names,
                        name: item.name,
                        count: item.name_count,
                        index: filterfake2.length
                    })


                }

            }

        })


        let counts = {};
        filter.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });


        return {filter: filter, filterResult: filterfake2.length};

    }

    searchAutoCompleteDisplay = () => {
        let resultAutoComplete = this.searchAutoComplete(this.props.search).filter //1
        let autCompCheck = []
        return resultAutoComplete.length > 0 && resultAutoComplete.map((res, i) => {

            let pair = {
                filter: res.filter,
                name: res.name
            }

            return (

                <div key={i} style={{width: '100%'}}>
                    <ListItem button className="input" >
                        <ListItemText data-tag={res} className="autoComplete_item" inset primary={res.name +' ('+res.count+')'} secondary={res.filter} onClick={this.props.manualSearchAutComplete.bind(null, res.filter, pair)}/>

                    </ListItem>
                    {
                        (res.index >= 21 &&  !this.state.hideFilterMore  ) &&  ( <ListItem button className="input see_more_filter">
                            <ListItemText data-tag={res} className="autoComplete_item" inset primary={'See ' + this.state.filterResult+' more'} onClick={this.increaseFilter}/>
                        </ListItem>)
                    }
                </div>



            )

        })
    }
    increaseFilter = () => {
        this.setState({single: '', resultAutoComplete: this.searchAutoComplete(this.state.search, this.state.categories, false).filter,filter: this.searchAutoComplete(this.state.search, this.state.categories, false).filter , hideFilterMore: true})
    }
    increaseFilter2 = () => {
        this.setState({single: '', resultAutoComplete: [],filter: this.searchAutoComplete(this.state.search, this.state.categories, false).filter , hideFilterMore: true})
    }

    render(){
        return(
            <div>
            {this.props.search && <div className="autoComplete">
                <List id="Input">
                    {this.searchAutoCompleteDisplay()}
                </List>
            </div>}
            </div>
        )
    }
}

export default AutoComplete

