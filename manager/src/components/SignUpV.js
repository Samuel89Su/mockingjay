'use strict'

import React, { Component } from 'react'
import { Segment, Button, Form, Input, Icon } from 'semantic-ui-react'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import '../styles/login.scss'
import md5 from 'js-md5'

class SignUpV extends Component {
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
        return (
            <div className='dv_login'>
                <div className='seg-login'>
                    <Segment padded className='seg-login-content'>
                        <Form>
                            <Input placeholder='user name' name='userName'
                                className='ipt_login_usrName'
                                value={this.state.userName} onChange={this.handleChange} />
                            <Input action name='psw'
                                className='ipt_login_psw'
                                value={this.state.psw} onChange={this.handleChange}>
                                <input placeholder='password' type={this.state.pswInputType}/>
                                <Button icon inverted={this.state.displayPsw} onClick={this.showPsw}>
                                    <Icon name='eye' color='blue' />
                                </Button>
                            </Input><br/>
                            <Input action name='confirmPsw'
                                className='ipt_login_psw'
                                value={this.state.confirmPsw} onChange={this.handleChange}>
                                <input placeholder='confirm password' type={this.state.pswInputType}/>
                                <Button icon inverted={this.state.displayPsw} onClick={this.showPsw}>
                                    <Icon name='eye' color='blue' />
                                </Button>
                            </Input>
                            <input type='hidden'/>
                        </Form>
                        <Button primary fluid onClick={this.signup}>Sign up</Button>
                    </Segment>
                </div>
            </div>
        )
    }
}

export default SignUpV