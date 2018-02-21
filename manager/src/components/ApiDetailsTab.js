import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import ApiCfgC from './ApiCfgC'
import ApiSchemaC from './ApiSchemaC'
import ApiMcCfgC from './ApiMcCfgC'

class ApiDetailsTab extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<Tab menu={{ color: 'olive', inverted: true, attached: false, tabular: false }} 
                panes={[
                    { menuItem: 'Details', render: () => <Tab.Pane attached={false}><ApiCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                    { menuItem: 'Schema', render: () => <Tab.Pane attached={false}><ApiSchemaC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                    { menuItem: 'Mock', render: () => <Tab.Pane attached={false}><ApiMcCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> }
                  ]} />)
    }
}

export default ApiDetailsTab
