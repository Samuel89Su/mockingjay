'use strict'

import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import queryString from 'query-string'
import AppCfg from '../Controllers/AppCfgController'
import UserList from '../Controllers/UserListController'

class AppDetailsTab extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
            ? this.props.location.search
            : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
    }

    render() {
        return (
            <div className='details-tab'>
                <Tab menu={{ color: 'olive', inverted: true, attached: false, tabular: false }}
                    panes={[
                        {
                            menuItem: '详情',
                            render: () => <Tab.Pane attached={false}><AppCfg location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane>
                        },
                        {
                            menuItem: '共享用户',
                            render: () => <Tab.Pane attached={false}><UserList location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane>
                        }
                ]} />
            </div>)
    }
}

export default AppDetailsTab
