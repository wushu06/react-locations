import React from 'react';
import axios from 'axios'
import Header from '../../../containers/Header'
import {TextField, Button} from '@material-ui/core'

const username = process.env.REACT_APP_GF_USERNAME;
const password = process.env.REACT_APP_GF_PASSWORD;


class Form extends React.Component {
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

        let basicAuth = 'Basic ' + btoa(username + ':' + password);
        let _self = this
        axios.get( process.env.REACT_APP_SITE_URL+'/wp-json/gf/v2/forms/1',  {
            auth: {
                username: username,
                password: password
            },
        })
            .then(res => {
                let formsData = res.data.fields
                console.log(res.data);
                _self.setState({
                    form: [
                        formsData
                    ],
                    // 'message': res.data.response.confirmations["5af07fdc16e2a"] ? res.data.response.confirmations["5af07fdc16e2a"].message : 'Thank you for getting in touch!'
                })
            })

    }



    displayForm = () => {

        return  this.state.form.map((post) => {
            return post.map((input) => {

                let field;
                switch (input.type) {
                    case 'text':
                        field = <TextField

                            required={input.required}
                            label={input.label}
                            onChange={this.handleChange(input.id)}

                        />
                        break;
                    case 'textarea':
                        field = <TextField
                            required={input.required}
                            label={input.label}
                            multiline
                            className="text_area"
                            rows="4"
                            onChange={this.handleChange( input.id)}

                        />
                        break;
                    default:
                        field = <TextField
                            required={input.required}
                            label={input.label}
                            onChange={this.handleChange( input.id)}

                        />
                }

                return (<div key={input.id}>
                            {field}
                            <br/>
                        </div>)

            })


        })
    }


    submitHandler = (e) => {
        e.preventDefault()

        let entry_id
        axios.post( process.env.REACT_APP_SITE_URL+'/wp-json/gf/v2/entries',this.state.input_ids,  {
            auth: {
                username: username,
                password: password
            },
        })
            .then(response =>{

                entry_id = response.data.id

            })
            .then(()=> {
                if(entry_id) {
                    this.sendNotificaiton(entry_id)
                }
            })
            .catch(error => {
                console.log(error);

            });

    }
    sendNotificaiton = (id) => {

        axios.post( process.env.REACT_APP_SITE_URL+`/wp-json/gf/v2/entries/${id}/notifications`,{},  {
            auth: {
                username: username,
                password: password
            },
        })
            .then(response =>{
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);

            });
    }

    handleChange = input_1 => event => {
        this.setState({
            'input_ids': {
                ...this.state.input_ids,
                form_id: 1,
                [input_1]: event.target.value,
            }
        });
    };


    render() {

        return (
            <div>
                <Header />


                     <h1  >form</h1>

                {
                    this.state.form.length > 0 && (<div>
                        <form  noValidate autoComplete="off" action="">
                            {this.displayForm()}
                            <Button
                                color="primary"
                                type="submit"
                                onClick={this.submitHandler}
                            >Send</Button>
                        </form>
                    </div>)
                }



            </div>
        )
    }
}

export default Form;