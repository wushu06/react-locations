import React from 'react';
import { Grid} from '@material-ui/core'
import axios from 'axios'
import Slider from "react-slick";
import ArrowBack from '@material-ui/icons/ChevronRight'
import ArrowForward from '@material-ui/icons/ChevronLeft'
import Spinner from '../../containers/UI/Spinner'

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

    componentDidMount() {

        this.getLocation()
        /* })
       /* catch(function (error) {
             // handle error
             console.log(error);
         })
*/
    }
    async getLocation(){
        let tokenURL =  process.env.REACT_APP_TOKEN;
        let username = process.env.REACT_APP_USERNAME;
        let password = process.env.REACT_APP_PASSWORD;
        let locationURL =   process.env.REACT_APP_SINGLE_LOCATION+this.props.id;
        const user = new URLSearchParams()
        user.append('username', username)
        user.append('password', password)


        let _self = this
        /* axios.post(tokenURL, user)
              .then(function (response) {
                  console.log(response.data.token);
                  _self.setState({
                     token: response.data.token,
                  })

              })
              .then(()=>{*/
        let token ='eyJhbGciOiJSUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcm5hbWUiOiJpbmZvQGFtaXJmcmVlbGFuY2UuY29tIiwiaWF0IjoxNTUyNjQ4NzY0LCJleHAiOjE1NTI2NTIzNjR9.izOkZX2yTBMKxzCPPjRhzjv4Z82hJPtLa8oIRuxWx5YsNR2mSXRu2THy7lT2dIEFB_P5qeDtjmz0AnRf0VjRnlrfXok2lwutUAvrGifY-TcaSZSF8rUXX4dUuo7ojqv32oUar0HKJ3NyN9pq1rJ9C5wUYYfZw_YE_49pY4OA-YbpyS30qc2h4jYWJtqhGOlwUNHhScEWsFgY6ys9ncqk9BrD1PVkDoD36zXtU1oMgUhQnDW_AkxyZa-k1d_jEm5Kcg4_Z2yk4kBhko5rT4D9KGE0ppe6Ae8c20QxsQWdSK7eakgJOknzXQIIMnDqliwNA501ks4-3groLdwygVZtWG9gVLPvsjcSrrhqFY7IjU_mVCC2_7RxxvGGOa1fuHXNRXu8GcQDS-PWIQBwGer7Tu5SpaZOzQ4TLW70V3s0GXjbKju81BcR7CUgGUHm7rp2RAkHgPUBQsROfWgFTFpiFtUPvpl6e5sklI4rVF-rZBt4EU_mPDB4sit2KO0QathpE2X3h80P_LC5EIB2tZru_BvQSdJN34MO4rg6beu6N8aORDB-m0y2yGaZ2ds-fVDp7ybANiU3mbL95PjUPt1p02LcynW7Zn9GiVu7dNtcRqlaZYq8GULosR0s0YI1rEusYkatzocv8E3c8QH-8nEY-AhkLKKTCMF1KgOJbnf7cIA'
        const AuthStr = 'Bearer '.concat(token);
        await axios.get(locationURL, { headers: { Authorization: AuthStr } })
            .then(function (response) {
                console.log(response.data.data);
                _self.setState({
                    single: response.data.data,
                    loading: false,
                })

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
            prevArrow: <SamplePrevArrow />
        };
        let location = this.state.single
        return  (<div className="result_list">



            <h2>Location name: {location.name}</h2>
            <Grid container spacing={24}>
                <Grid item sm={8} xs={12}>
                    <p>Location description: </p>
                    <div dangerouslySetInnerHTML={{ __html:location.Description}} />*
                </Grid>
                <Grid item sm={4} xs={12}>
                    <p>Town: {location.Town}</p>
                    <p>Address1: {location.Address1}</p>
                    <p>County: {location.County}</p>
                    <p>Region: {location.Region}</p>
                    <p>Exclusive: {location.Exclusive === 'No' ? 'No' : 'Yes'}</p>
                </Grid>
            </Grid>
        </div>)

    }

    render() {

        return (
            <div className="single">

                <div ref={node => (this.messagesEnd = node)} />
                <div>start des</div>
                { this.displayLocation()}

            </div>

        )
    }
}

export default Single;