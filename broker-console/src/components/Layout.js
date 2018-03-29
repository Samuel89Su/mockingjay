'use strict'

import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'
import '../styles/layout.scss'

class Layout extends Component {
    render() {
        return (
            <Container>
                <Header as="h1">
                    Mockingjay
                </Header>
                <div>
                    { this.props.children }
                </div>
            </Container>
        )
    }
}

export default Layout