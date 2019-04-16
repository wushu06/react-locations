import React from 'react';
import axios from 'axios'
import Header from '../../../containers/Header'
import {TextField, Button} from '@material-ui/core'


const username = process.env.REACT_APP_GF_USERNAME;
const password = process.env.REACT_APP_GF_PASSWORD;

class Page extends React.Component {
    state = {
        page: [],
        loading: false,
        id:'',
        title: '',
        content: '',
        image: '',
        form: [],
        input_ids: {}
    }

    componentDidMount() {

            // let slug  = this.props.match.params[0];
            let slug = this.props.location.pathname;
            let path = window.location.pathname;
            let page = path.split("/").pop();
            let menuURL = process.env.REACT_APP_SITE_URL + "/wp-json/wp/v2/pages/?slug=" + page + "&_embed";
            let _self = this
            axios(menuURL)
                .then(res => {

                    res.data.length > 0 && _self.setState({
                        page: res.data,
                        id: res.data[0].id,
                        title: res.data[0].title.rendered,
                        content: res.data[0].content.rendered,
                        featureID: res.data[0].featured_media

                    })

                })

    }


    showFeaturedImage = () => {
        let id = this.state.featureID
        let mediaURL = `https://wordpress-214959-758053.cloudwaysapps.com/wp-json/wp/v2/media/${id}`
        let _self = this
        axios(mediaURL )
            .then(res => {

                _self.setState({
                  image: res.data.source_url

                })
            })
    }




    render() {

        return (
            <div>
                <Header />
                <h1>single page</h1>


                <div className="block_single">
                    <div className="block_small_container">
                        <div className="row">
                            <div className="col-md-12 block_single_image">
                                {this.state.featureID ? this.showFeaturedImage() : ""}
                                {this.state.image &&  <img src={this.state.image} alt=""  width="900"/> }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 col-sm-9 col-xs-12 block_single_content">
                                <h1>{this.state.title}</h1>
                                <div className="title-separator"></div>
                                <p dangerouslySetInnerHTML={{__html: this.state.content}} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Page;