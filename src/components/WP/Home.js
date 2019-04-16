import React from 'react';
import Header from '../../containers/Header'
import Spinner from '../../containers/UI/Spinner'
import Page from './Pages/Page';
import {Switch, Route} from 'react-router-dom'

class WP extends React.Component {
    state = {
        loading: true,
        template: 'default'
    }
    componentDidMount(){

        this.setState({
            loading: false,
        })


    }

    loopSlugs = () => {

    }
    render() {
        const {template, loading} = this.state
        return loading ? <Spinner /> : (
            <div>

                <Header/>
                <h1>Home</h1>
            </div>
        )

    }
}

export default WP;