'use strict'

import React, { Component } from 'react'
import { Container, Button, Icon } from 'semantic-ui-react'
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
                location.reload()
            },
            (err)=>{})
    }

    render() {
        return (
            <Container className='layout-header-container'>
                <div className='header-line'>
                    <b className='layout-header'>
                        Mockingjay
                    </b>
                    <Button Icon className='btn-logout' color='olive'
                        onClick={this.logout}>
                        <Icon name='log out' color='violet' size='teal' />
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