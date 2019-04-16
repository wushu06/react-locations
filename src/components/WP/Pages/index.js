import React from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';

class Pages extends React.Component {
    state = {
        pages: [],
        loading: false
    }

    componentDidMount() {
        let menuURL = process.env.REACT_APP_SITE_URL+"/wp-json/wp/v2/pages?_embed";
        let _self = this
        axios(menuURL)
            .then(res => {

                _self.setState({
                    pages: res.data
                }, ()=> this.displayPages())

            })
    }
    showFeaturedImage = id => {
        let mediaURL = `https://wordpress-214959-758053.cloudwaysapps.com/wp-json/wp/v2/media/${id}`
        let _self = this
        axios(mediaURL )
            .then(res => {
                console.log(res);

            })
    }
    displayPages = () => {

      return  this.state.pages.map((page, key) => {
          page.featured_media && this.showFeaturedImage(page.featured_media)
            return(<div key={key}>
                <Link to={'/page/' + page.slug}><h2>{page.title.rendered}</h2></Link>
            </div>)
        })
    }
    render() {
      
        return (
            <div>
                <h1>Page index</h1>
                {this.state.pages.length > 0 &&
                    this.displayPages()
                }
            </div>
        )
    }
}

export default Pages;