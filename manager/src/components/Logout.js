'use strict'

import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import '../styles/logout.scss'

class Logout extends Component {
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
        (err) => {})
  }

  render() {
    return (<Button icon className = 'btn-logout'
        color = 'olive' onClick = { this.logout }>
        <Icon name = 'log out' color = 'violet' />
      </Button>)
  }
}

export default Logout
