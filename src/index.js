import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import App from './App';
import {createStore} from 'redux';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {Provider, connect} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import WP from './components/WP/Pages/Page';
import J1 from './components/J1';
import Single from './components/J1/Single';
import SingleCaseStudy from './components/WP/CaseStudy/SingleCaseStudy';
import CaseStudy from './components/WP/CaseStudy';
import ProductionSpaces from './components/WP/ProductionSpaces';
import Form from './components/WP/Pages/Form';
import SingleProductionSpaces from './components/WP/ProductionSpaces/SingleProductionSpaces';
import Home from './components/WP/Home';
import Spinner from './containers/UI/Spinner'
import Searchv1 from './components/J1/versions/SearchV1';
import Searchv2 from './components/J1/versions/SearchV2';
import Searchv3 from './components/J1/versions/SearchV3';
import Animation from './Animation';
import axios from 'axios'
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    state = {
        menus: [],
        wpRoutes: [],
        j1Routes: [],
       csRoutes: [],
        psRoutes: [],
        formRoutes: [],
        single: '',
        sheet: ''
    }

    componentDidMount() {

        let menuURL = process.env.REACT_APP_SITE_URL+'/wp-json/wp/v2/menus/2';

        let wpRoutes = [];
        let j1Routes = [];
        let csRoutes = [];
        let psRoutes = [];
        let formRoutes = [];
        let _self = this;
        axios.get(menuURL)
            .then(function (response) {



                let single = '';
                let sheet = '';

                (response.data.data.items).map(item => {

                if( item.url === process.env.REACT_APP_SITE_URL+"/locations/" ) {
                    j1Routes.push('/' + item.object_slug)
                }else if( item.url === process.env.REACT_APP_SITE_URL+"/contact-us/" ) {
                        formRoutes.push('/' + item.object_slug)
                }else if( item.url === process.env.REACT_APP_SITE_URL+"/case-study/" ) {
                    csRoutes.push('/' + item.object_slug)
                    if( item.children && item.children.length > 0 ) {
                        item.children.map(child => {
                            //csRoutes.push('/'+item.object_slug+ '/'+child.object_slug)
                        })
                    }
                }else if( item.url === process.env.REACT_APP_SITE_URL+"/production-spaces/" ) {
                     psRoutes.push('/' + item.object_slug)
                }else{
                     wpRoutes.push('/'+item.object_slug)
                    if( item.children && item.children.length > 0 ) {
                         item.children.map(child => {
                            wpRoutes.push('/'+item.object_slug+ '/'+child.object_slug)
                        })
                    }


                }

                    _self.setState({
                        wpRoutes,
                         j1Routes,
                        csRoutes,
                        psRoutes,
                        formRoutes,
                        single: single,
                        sheet: sheet
                    })
                })
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })

    }

    render() {

        return (
            <Route render={({location}) => (
                <TransitionGroup>
                    <CSSTransition
                        key={location.key}
                        timeout={450}
                        classNames="fade"
                    >
                        <Switch>
                            <Route exact path='/' component={J1}/>
                            <Route exact path='/v1' component={Searchv1}/>
                            <Route exact path='/v2' component={Searchv2}/>
                            <Route exact path='/v3' component={Searchv3}/>
                            <Route  path='/single/:Id' component={Single}/>
                        </Switch>
                    </CSSTransition>
                </TransitionGroup>
            )} />

        );
    }
}



const RootWithAuth = withRouter((Root))

ReactDOM.render(<Provider store={store}>
    <Router>
        <RootWithAuth/>
    </Router>
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();