import React from 'react';

import Header from './containers/Header'
import {TextField, Button} from '@material-ui/core'
import {
    CSSTransition,
    TransitionGroup,
    Transition
} from 'react-transition-group';
import { bounce, fadeIn, fadeInUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import {TweenLite}  from "gsap/TweenMax";
const styles = {
    bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(fadeInUp, 'fadeInUp'),
        width: '100px',
        height: '100px',
        background: 'red'
    }
}

const username = process.env.REACT_APP_GF_USERNAME;
const password = process.env.REACT_APP_GF_PASSWORD;


class Animation extends React.Component {
    state = {

        loading: true,

    }

    componentDidMount() {
        this.myTween = TweenLite.to(this.myElement, 1, {x: 100, y: 100});


    }


    render() {

        return (
            <div>
                <Header />
                <StyleRoot>
                    <div className="test" style={styles.bounce}>
                    </div>
                </StyleRoot>
                <div style={{background: 'green', width: '100px', height: '100px'}} ref={div => this.myElement = div}></div>

                <CSSTransition
                    in={this.state.loading}
                    timeout={300}
                    classNames="message"
                    onEnter={(node)=> console.log(node)}
                    onExited={(node) => {
                        console.log('done'+node)
                    }}
                >
                    <h1>form</h1>
                </CSSTransition>

                <Transition
                    timeout={1000}
                    mountOnEnter
                    //unmountOnExit // this will revese the animation
                    in={this.state.loading}
                    addEndListener={(node, done) => {
                        TweenLite.from(node,2, {
                            y: 0,
                            autoAlpha: this.state.loading ? 1 : 0,
                            //onComplete: done,
                            delay: 1 * 0.15
                        });
                    }}
                >
                    <div style={{background: 'purple', width: '100px', height: '100px', }} ></div>
                </Transition>

            </div>
        )
    }
}

export default Animation;