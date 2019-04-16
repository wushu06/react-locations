import React from 'react';
import Header from '../../../containers/Header'
import Spinner from '../../../containers/UI/Spinner'
import axios from 'axios'

class SingleCaseStudy extends React.Component {
    state = {
        page: [],
        loading: false,
        id:'',
        title: '',
        content: '',
        image: '',
    }

    componentDidMount() {
        // let slug  = this.props.match.params[0];
        let slug  = this.props.location.pathname.replace('/case-study/','');

        let menuURL = process.env.REACT_APP_SITE_URL+"/wp-json/wp/v2/case-study?slug="+slug+"&_embed";
        let _self = this
        axios(menuURL)

            .then(res => {

                _self.setState({
                    page: res.data,
                    id: res.data[0].id,
                    title: res.data[0].title.rendered,
                    content: res.data[0].content.rendered,
                    featureID: res.data[0].featured_media

                })

            })
    }

    showFeaturedImage = id => {
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
                <Header/>
                <h1>single CASE STUDY page</h1>
                <div className="block_single">
                    <div className="block_small_container">
                        <div className="row">
                            <div className="col-md-12 block_single_image">
                                {this.state.featureID && this.showFeaturedImage(this.state.featureID)}
                                {this.state.image &&  <img src={this.state.image} alt=""  width="900"/> }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9 col-sm-9 col-xs-12 block_single_content">
                                <h1>{this.state.title}</h1>
                                <div className="title-separator"></div>
                                <p dangerouslySetInnerHTML={{__html: this.state.content}} />
                            </div>
                            <div className="col-md-3 col-sm-3 col-xs-12">
                                <ul className="stick-scroll">
                                    <li className="block_single_author"></li>
                                    <li><span className="text-center">SHARE</span></li>
                                    <li></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="block_blog">
                    <div className="block_small_container">
                        <div className="row block_blog_title">
                            <div className="col-xs-12 col-md-12">
                                <h1>More like this</h1>
                                <div className="title-separator"></div>
                            </div>
                        </div>
                        <div className="row">
                            <div id="lazyload">
                                <div className="col-md-4 col-xs-12">
                                    <div className="block_blog_wrapper_image">
                                        <a className="animsition-link" data-animsition-out-className="zoom-out-sm" href="">
                                            <img alt="" className="img-responsive" src="" />
                                            <div className="block_blog_wrapper_image_overlay">
                                                <span>Find out more</span>
                                            </div>
                                        </a>
                                    </div><a href="">
                                    <h2 className="height-fix"></h2></a>
                                    <div className="row block_blog_meta">
                                        <div className="col-md-4 col-xs-2"></div>
                                        <div className="col-md-8 col-xs-8">
                                            <p>POSTED <strong></strong><br />
                                                BY <strong></strong></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="block_single_back text-center">
                            <a className="red-button hvr-sweep-to-right" href="">BACK TO THE BLOG LIST</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SingleCaseStudy;