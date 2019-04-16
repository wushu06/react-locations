import React from 'react';
import {Link} from 'react-router-dom'

class Posts extends React.Component {
    state = {
        posts: [],
        loading: false
    }

    componentDidMount() {
        let menuURL = "http://woocommerce-214959-738295.cloudwaysapps.com/wp-json/wp/v2/posts?_embed";

        fetch(menuURL)
            .then(res => res.json())
            .then(res => {

                this.setState({
                    posts: res
                }, ()=> this.displayPosts())

            })
    }

    displayPosts = () => (
        this.state.posts.map( (page, key)=>  (
            <div key={key}>
                <Link to={'/post/'+page.slug}> <h2>{page.title.rendered}</h2></Link>
            </div>
        ))
    )
    render() {

        return (
            <div>
                <h1>Posts index</h1>
                {this.state.posts.length > 0 &&
                    this.displayPosts()
                }
            </div>
        )
    }
}

export default Posts;