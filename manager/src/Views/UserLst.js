'use strict'

import React, { Component } from 'react'
import { List } from 'semantic-ui-react'

class UserList extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        try {
            if (!!this.props.fetchData) {
                this.props.fetchData()
            }
        } catch (error) {
            console.log(this.props.users)
        }
    }

    render() {
        if (!this.props.users || this.props.users.length === 0) {
            return null
        }
        return (
            <div id='app-list'>
                  <List divided horizontal>
                  {
                      this.props.users.map((user, index) => {
                          return (<List.Item key={index}>
                                    <List.Content>
                                        <List.Header>{user.name}
                                        </List.Header>
                                    </List.Content>
                                </List.Item>)
                      })
                  }
                  </List>
            </div>
        )
    }
}

export default UserList
