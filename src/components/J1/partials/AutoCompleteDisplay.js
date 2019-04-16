import React, { Component, PropTypes } from "react";
import {ListItemText,ListItem, List, Button} from '@material-ui/core'
import AutoComplete from '../../../lib/AutoComplete'

const autoCompleteLib = new AutoComplete();
class AutoCompleteDisplay extends React.Component {
    state = {
        filter: [],
        filterResult: '',
        resultAutoComplete: [],
        hideFilterMore: false,
        increase: false,
        search : this.props.search
    }
    componentWillReceiveProps(newProp, oldProp){
        if(newProp.search !== this.props.search  ){

            this.setState({
                resultAutoComplete: [],
                hideFilterMore: false,
                search : newProp.search
            })
        }
    }
    componentDidMount(){

    }


    searchAutoCompleteDisplay = () => {

        let resultAutoComplete =  autoCompleteLib.searchAutoComplete(this.props.search, this.props.categories).filter //1

        let autCompCheck = []
        return resultAutoComplete.length > 0 && resultAutoComplete.map((res, i) => {

            let pair = {
                filter: res.filter,
                name: res.name
            }
            let filterResult = autoCompleteLib.searchAutoComplete(this.props.search, this.props.categories).filterResult

            return (
                <div key={i} style={{width: '100%'}} className="autoComplete_child">
                    <ListItem button className="input" data-search={res.name} data-filter={res.filter}>
                        <ListItemText  className="autoComplete_item" inset primary={res.name +' ('+res.count+')'} secondary={res.filter} onClick={this.props.manualSearchAutComplete.bind(null, res.filter, pair,false)}/>

                    </ListItem>
                    {
                        (res.index >= 21 &&  !this.state.hideFilterMore  ) &&  (
                            <div  className="see_more" onClick={this.increaseFilter}> {'See ' + filterResult+' more'} </div>
                       )
                    }
                </div>
            )

        })
    }
    increaseFilter = () => {

        this.setState({
          increase: true, resultAutoComplete: autoCompleteLib.searchAutoComplete(this.props.search, this.props.categories, false).filter,filter: autoCompleteLib.searchAutoComplete(this.props.search, this.props.categories, false).filter , hideFilterMore: true
        })
    }

    render(){
        return(

            this.props.search &&
            <div>
                <div className="autoComplete">
                    <List id="Input">
                        {this.state.search  && this.searchAutoCompleteDisplay()}
                    </List>
                </div>
            </div>

        )
    }
}

export default AutoCompleteDisplay

