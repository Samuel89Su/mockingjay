'use strict'

import React, { Component } from 'react'
import { Container, Button } from 'semantic-ui-react'
import '../styles/layout.scss'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'

class Layout extends Component {
    constructor(props) {
        super(props)

        this.logout = this.logout.bind(this)
    }

    logout() {
        fetchRemote(InventoryAPI.logout)
        .then(
            () => {
                history.pushState(null, null, '/login')
            },
            (err)=>{})
    }

    render() {
        return (
            <Container>
                <div className='layout-header-container'>
                    <b className='layout-header'>
                        Mockingjay
                    </b>
                    <Button basic inverted className='btn-logout'
                        onClick={this.logout}>
                    Logout
                    </Button>
                </div>
                
                <div>
                    { this.props.children }
                </div>
            </Container>
        )
    }
}

export default Layout