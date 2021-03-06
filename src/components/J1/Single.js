import React from 'react';
import { Grid, Button} from '@material-ui/core'
import axios from 'axios'
import Slider from "react-slick";
import ArrowBack from '@material-ui/icons/ChevronRight'
import ArrowForward from '@material-ui/icons/ChevronLeft'
import Spinner from '../../containers/UI/Spinner'
import {Link} from 'react-router-dom'
import { getToken} from '../../actions';
import { connect} from 'react-redux';

let once = true;
function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <ArrowBack className={className } onClick={onClick} />

    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <ArrowForward className={className } onClick={onClick}/>

    );
}

class Single extends React.Component {
    state = {
        single: [],
        token: '',
        loading: true,
        id:this.props.id,
        title: '',
        content: '',
        image: this.props.image,
    }

    componentWillMount(){

    }


    componentDidMount(){

        let self = this;
        ( this.props.getToken().payload.token).then(function (value) {
                self.getLocation(value)
        })
    }


    async getLocation(token){

        let tokenURL =  process.env.REACT_APP_TOKEN;
        let username = process.env.REACT_APP_USERNAME;
        let password = process.env.REACT_APP_PASSWORD;
        let locationURL =   process.env.REACT_APP_SINGLE_LOCATION+this.props.match.params.Id;
        const user = new URLSearchParams()
        user.append('username', username)
        user.append('password', password)

        console.log(token);
        let _self = this

            const AuthStr = 'Bearer '.concat(token);
            await axios.get(locationURL, { headers: { Authorization: AuthStr } })
                .then(function (response) {
                    console.log(response.data);
                    _self.setState({
                        single: response.data.data,
                        loading: false,
                    })


                 })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
    }
    componentDidUpdate(prevProps, prevState) {

        if(prevProps.image !==this.props.image){

            this.setState({id: this.props.id, image: this.props.image})
            this.displayLocation(this.props.id)
            if (this.messagesEnd) {
                this.scrollToTop();
            }
        }
    }
    scrollToTop = () => {
        this.messagesEnd.scrollIntoView({behavior: "smooth"});
    }
    displayLocation = () => {
        let settings = {

            slidesToShow: 1,
            slidesToScroll: 1,
            nextArrow: <SampleNextArrow />,
            prevArrow: <SamplePrevArrow />,
            onInit: (slider)=>
                console.log(slider),
            beforeChange: (current, next) =>
                console.log(current),

        };
        let location = this.state.single
        return  (<div className="result_list">


            <h2>Location name: {location.name}</h2>
            <Grid container spacing={24}>

                <Grid lg={4} md={4} sm={4} xs={12}>
                    <div className="result_list_content">
                        <p>Location description: </p>
                        <div dangerouslySetInnerHTML={{ __html:location.Description}} />*

                    <div>
                        <p>Town: {location.Town}</p>
                        <p>Address1: {location.Address1}</p>
                        <p>County: {location.County}</p>
                        <p>Region: {location.Region}</p>
                        <p>Exclusive: {location.Exclusive === 'No' ? 'No' : 'Yes'}</p>
                    </div>
                    </div>
                </Grid>
                <Grid lg={8} md={8} sm={8} xs={12}>
                    <div>
                        {this.state.loading && <Spinner/>}
                        {location.Images && location.Images.map(img=> {console.log(img.path);
                            return(
                                <img className="img-responsive" src={'http://testj1.location-collective.co.uk'+img.path} alt=""/>
                            )
                        } )}
                    </div>
                </Grid>

            </Grid>
        </div>)

    }

    render() {

        return (
            <div className="single">
                <div>
                    <Button className="link_btn"><Link to="/">Back</Link></Button>
                </div>

                <div ref={node => (this.messagesEnd = node)} />
                {!this.loading && this.displayLocation() }
            </div>

        )
    }
}


const mapStateToProps = state => ({
    token: state.token.token
})
export default connect(mapStateToProps,{ getToken} )(Single);