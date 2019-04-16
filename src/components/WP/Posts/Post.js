import React from 'react';

class Post extends React.Component {
    state = {
        post: [],
        loading: false,
        id:'',
        title: '',
        content: '',
        image: '',
    }

    componentDidMount() {
        let slug  = this.props.match.params[0];
        let menuURL ="http://woocommerce-214959-738295.cloudwaysapps.com/wp-json/wp/v2/posts/?slug="+slug+"&_embed";

        fetch(menuURL)
            .then(res => res.json())
            .then(res => {
                let img = res[0]._embedded['wp:featuredmedia'] ? res[0]._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url : 'http://via.placeholder.com/350x150';
                this.setState({
                    post: res,
                    id: res[0].id,
                    title: res[0].title.rendered,
                    content: res[0].content.rendered,
                    image: img
                })

            })
    }


    render() {

        return (
            <div>
                <h1>single post</h1>
                <div className="block_single">
                    <div className="block_small_container">
                        <div className="row">
                            <div className="col-md-12 block_single_image">
                                <img src={this.state.image} alt="" />
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

export default Post;