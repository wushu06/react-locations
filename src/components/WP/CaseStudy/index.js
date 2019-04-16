import React from 'react';
import Header from '../../../containers/Header'
import Spinner from '../../../containers/UI/Spinner'
import axios from 'axios'
import {Link} from 'react-router-dom'

class Index extends React.Component {
    state = {
        loading: true,
        template: 'default',
        posts: []
    }
    componentDidMount(){
        let csURL = process.env.REACT_APP_SITE_URL+"/wp-json/wp/v2/case-study?_embed";
        this.setState({
            loading: false,
        })
        let _self = this
        axios(csURL)
            .then(res => {

                _self.setState({
                    posts: res.data
                }, ()=> this.displayPosts())

            })


    }
    displayPosts = () => {
       return this.state.posts.map((page, key) => {

            return(<div key={key}>
                        <Link to={'/case-study/' + page.slug}><h2>{page.title.rendered}</h2></Link>
                    </div>)
        })
    }
    loopSlugs = () => {

    }
    render() {
        const {template, loading} = this.state
        return loading ? <Spinner /> : (
            <div>
                <Header/>

                <h1>case study cpt</h1>
                {this.state.posts.length > 0 &&
                this.displayPosts()}

            </div>
        )

    }
}

export default Index;