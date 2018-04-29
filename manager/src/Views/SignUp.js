'use strict'

import React, { Component } from 'react'
import { Segment, Button, Form, Grid, Image, Header } from 'semantic-ui-react'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import '../styles/login.scss'
import md5 from 'js-md5'

class SignUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            psw: '',
            confirmPsw: '',
            displayPsw: false,
            pswInputType: 'password'
        }

        this.signup = this.signup.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.showPsw = this.showPsw.bind(this)
    }

    signup() {
        if (!this.state.userName || !this.state.psw) {
            alert('need user name and password')
            return
        }
        if (!this.state.confirmPsw) {
            alert('confirm password first')
            return
        }
        let payload = {
            userName: this.state.userName,
            psw: md5(this.state.psw)
        }
        let json = JSON.stringify(payload)
        fetchRemote(InventoryAPI.signup, json)
        .then(
            (data)=>{
                if (data) {
                    this.props.history.push('/login')
                } else {
                }
            },
            (err)=>{
                alert(err.message)
            })
    }

    showPsw() {
        this.setState({
            pswInputType: !this.state.displayPsw ? 'text' : 'password',
            displayPsw: !this.state.displayPsw,
            psw: this.state.psw
        })
    }

    handleChange(evt, data) {
        let newState = {}
        newState[data.name] = data.value
        if (data.name === 'confirmPsw') {
            if (data.value.length > this.state.psw.length) {
                alert('the password must same value')
                return
            } else if (!this.state.psw.startsWith(data.value)) {
                alert('the password must same value')
                return
            }
        }
        this.setState(newState)
    }

    render() {
        return (<div className='login-form'>
            <Grid
                textAlign='center'
                style={{ height: '100%' }}
                verticalAlign='middle' >
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                    <Image src={require('../images/login.png')} />{' '}register your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input name='userName'
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='User Name'
                                value={this.state.userName}
                                onChange={this.handleChange} />
                            <Form.Input name='psw'
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                value={this.state.psw}
                                onChange={this.handleChange} />
                            <Form.Input name='confirmPsw'
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='confirm password'
                                type='password'
                                value={this.state.confirmPsw}
                                onChange={this.handleChange} />
                            <input type='hidden'/>

                            <Button color='teal' fluid size='large' onClick={this.signup}>Sign up</Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        </div>)
    }
}

export default SignUp