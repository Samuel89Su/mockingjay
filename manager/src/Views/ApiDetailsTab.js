'use strict'

import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import ApiCfgC from '../Controllers/ApiCfgC'
import ApiSchemaC from '../Controllers/ApiSchemaC'
import ApiMcCfgC from '../Controllers/ApiMcCfgC'
import queryString from 'query-string'
import { Button } from 'semantic-ui-react'
import ApiExampleC from '../Controllers/ApiExampleC'
import '../styles/details-tab.scss'

class ApiDetailsTab extends Component {
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
                <div>
                    <Button onClick={()=>this.props.history.push(`/app/apilist?appId=${this.state.query.appId}&appName=${this.state.query.appName}`)} >返回接口列表</Button>
                </div>
                <Tab menu={{ color: 'olive', inverted: true, attached: false, tabular: false }}
                    panes={[
                        { menuItem: '详情', render: () => <Tab.Pane attached={false}><ApiCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                        { menuItem: '数据定义', render: () => <Tab.Pane attached={false}><ApiSchemaC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                        { menuItem: 'Mock 规则', render: () => <Tab.Pane attached={false}><ApiMcCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                        { menuItem: '示例', render: () => <Tab.Pane attached={false}><ApiExampleC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> }
                ]} />
            </div>)
    }
}

export default ApiDetailsTab
