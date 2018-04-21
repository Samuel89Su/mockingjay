'use strict'

import React, { Component } from 'react'
import { Segment, Divider, Button, Form, Input, Icon, Label } from 'semantic-ui-react'
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

        this.pswKey = 'gmib4p+|2^z%;*:=~o.<*n<q`<9.@,tc'
    }

    componentWillMount() {
        this.login()
    }

    login() {
        let cooktail = md5(this.state.psw + this.pswKey)
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

    showPsw() {
        this.setState({
            pswInputType: !this.state.displayPsw ? 'text' : 'password',
            displayPsw: !this.state.displayPsw,
            psw: this.state.psw
        })
    }

    handleChange(evt, data) {
        switch (data.name) {
            case 'userName':
                this.setState({userName: data.value})
                break;
            case 'psw':
            {
                this.setState({
                    psw: data.value
                })
            }
                break;
            default:
                break;
        }
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
                            </Input>
                            <input type='hidden'/>
                        </Form>
                        <Button primary fluid onClick={this.login}>Login</Button>
                        <Divider horizontal>Or</Divider>
                        <Button secondary fluid>Sign Up Now</Button>
                    </Segment>
                </div>
            </div>
        )
    }
}

export default LoginV