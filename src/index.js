import React from 'react';
import ReactDOM from 'react-dom';
import './App.scss';
import {createStore} from 'redux';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import J1 from './components/J1';

import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    state = {

    }

    componentDidMount() {

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
                <Route exact path='/locations' component={J1}/>
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