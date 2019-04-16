import React from 'react';
import Header from '../../containers/Header'
import Spinner from '../../containers/UI/Spinner'
import Pages from './Pages';
import Posts from './Posts';
import Post from './Posts/Post';
import Page from './Pages/Page';
import Form from './Pages/Form';
import {Switch, Route} from 'react-router-dom'

let check = false;
class WP extends React.Component {
    state = {
        loading: true,
        template: 'default',
        update: false
    }
    componentDidMount(){
        console.log('mo');
        this.setState({
            loading: false,
        })


    }
    componentWillUpdate(){
      this.callRoute()
        check = true;
    }

    callRoute = () => {
        if(check){
            this.setState({update: true})
        }

    }

    render() {
        const {template, loading} = this.state
        return loading ? <Spinner /> : (
            <div>

                <Header/>
                <h1>wordpress</h1>
                <Route  key="add-client" path="/contact-us" component={Form}/>
                <Route  key="add-client" path="/*" component={Page}/>



            </div>
        )

    }
}

export default WP;