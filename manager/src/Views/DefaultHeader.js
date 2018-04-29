'use strict'

import React from 'react'
import { Container } from 'semantic-ui-react'
import Logout from './Logout'
import '../styles/defaultHeader.scss'

const DefaultHeader = (props) => {
    if (props.hideHeader) {
        return null
    } else {
        return (
            <Container className="layout-header-container">
                <div className='header-line'>
                    <b className='layout-header'>Mockingjay</b>
                    <Logout />
                </div>
            </Container>
        )
    }
  }

export default DefaultHeader