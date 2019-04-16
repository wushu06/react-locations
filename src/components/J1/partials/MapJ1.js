import React from 'react';
import { GoogleApiWrapper, InfoWindow, Map, Marker, Polygon } from 'google-maps-react';
import {Paper, Typography } from  '@material-ui/core'
import house from '../../../assets/icon.png';



class MapJ1 extends React.Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
        markerInfoTitle: '',
        markerInfoDesc: '',
        markers: [{name: 'whatever', cord: { lat: 53.666588, lng: -1.682598 }},{name: 'whatever2', cord: { lat: 53.662774, lng: -1.681396 }} ],
        centerLat:'',
        centerLng: '',
        img: ''
    }
    componentDidMount(){
        // binding this to event-handler functions
        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
        if(this.state.centerLat === '') {
            this.setState({
                centerLat: this.props.cord[0].lat,
                centerLng: this.props.cord[0].lng
            })
        }

    }
    onMarkerClick = (props, marker, e) => {
        console.log(props);
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true,
            markerInfoTitle: props.title,
            markerInfoDesc: props.name,
            img: props.img
        });
    }
    onMapClick = (props) => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    }
    handlMouseLeave = () => {
        console.log('left');
    }
    displayMarkers = () => {

        return this.props.cord.map((marker, i) => {

            return (
                <Marker
                    key={i}
                    onClick= { this.onMarkerClick.bind(this) }
                    title = {marker.name}
                    position = {{ lat: marker.lat, lng: marker.lng }}
                    name = {marker.name}
                    img={marker.img}
                    icon={{
                        url: house,
                        anchor: this.props.google.maps.Point(32,32),
                        scaledSize: this.props.google.maps.Size(64,64)
                    }}
                />
            )
        })

    }
    render() {
        const style = {
            width: '100%',
            height: '100%',
            'marginLeft': 'auto',
            'marginRight': 'auto'
        }

        const {centerLat, centerLng, img} = this.state
        return (
            centerLat > 0 && <Map

                item
                xs={12}
                style={style}
                google={this.props.google}
                onClick={this.onMapClick}
                zoom={this.props.zoom}
                initialCenter={{lat: this.props.centerLat, lng: this.props.centerLng}}
                center={{lat: this.props.centerLat, lng: this.props.centerLng}}
            >
                {this.displayMarkers()}


                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}

                >
                    <Paper>
                        <Typography
                            variant='headline'
                            component='h4'
                        >
                            {this.state.markerInfoTitle}
                        </Typography>
                        {img && <img src={img} width="100" alt=""/>}
                        <Typography
                            component='p'
                        >
                            {this.state.markerInfoDesc}
                        </Typography>

                    </Paper>
                </InfoWindow>
            </Map>

        );
    }
}
export default GoogleApiWrapper({
    api: ('AIzaSyDUB5AAhHxkP5YOnHVEJ81V2-4EXXqheU0')
})( MapJ1)