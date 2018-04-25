'use strict'

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Button, Form, Grid, Header, Image, Message } from 'semantic-ui-react'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import '../styles/login.scss'
import md5 from 'js-md5'

class LoginV extends Component {
    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            psw: '',
            displayPsw: false,
            pswInputType: 'password'
        }

        this.login = this.login.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.showPsw = this.showPsw.bind(this)
        this.goToSignup = this.goToSignup.bind(this)

        this.pswKey = 'gmib4p+|2^z%;*:=~o.<*n<q`<9.@,tc'
    }

    componentWillMount() {
        this.login()
    }

    login() {
        let cooktail = !this.state.psw ? '' : md5(md5(this.state.psw) + this.pswKey)
        let payload = {
            userName: this.state.userName,
            psw: cooktail
        }
        let json = JSON.stringify(payload)
        fetchRemote(InventoryAPI.login, json)
        .then(
            (data)=>{
                if (data) {
                    this.props.history.push('/app')
                } else {
                }
            },
            (err)=>{
                alert(err.message)
            })
    }

    goToSignup() {
        this.props.history.push('/signup')
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
        this.setState(newState)
    }

    render() {
        return (<div className='login-form'>
            <Grid
            textAlign='center'
            style={{ height: '100%' }}
            verticalAlign='middle'
            >
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                <Image src={require('../images/login.png')} />{' '}Log-in to your account
                </Header>
                <Form size='large'>
                <Segment stacked>
                    <Form.Input name='userName'
                        fluid
                        icon='user'
                        iconPosition='left'
                        placeholder='User Name'
                        onChange={this.handleChange} />
                    <Form.Input name='psw'
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        onChange={this.handleChange} />
                    <input type='hidden'/>

                    <Button color='teal' fluid size='large' onClick={this.login}>Login</Button>
                </Segment>
                </Form>
                <Message>New to us?
                    <Link to={'/signup'}>Sign Up</Link>
                </Message>
            </Grid.Column>
            </Grid>
        </div>)
    }
}

export default LoginV