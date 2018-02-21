import React, { Component } from 'react'
import { Tab } from 'semantic-ui-react'
import ApiCfgC from './ApiCfgC'
import ApiSchemaC from './ApiSchemaC'
import ApiMcCfgC from './ApiMcCfgC'
import queryString from 'query-string'
import { Button } from 'semantic-ui-react'

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
            <div>
                <div>
                    <Button onClick={()=>this.props.history.push(`/app/apilist?appId=${this.state.query.appId}&appName=${this.state.query.appName}`)} >Back to list</Button>
                </div>
                <Tab menu={{ color: 'olive', inverted: true, attached: false, tabular: false }} 
                    panes={[
                        { menuItem: 'Details', render: () => <Tab.Pane attached={false}><ApiCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                        { menuItem: 'Schema', render: () => <Tab.Pane attached={false}><ApiSchemaC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> },
                        { menuItem: 'Mock', render: () => <Tab.Pane attached={false}><ApiMcCfgC location={this.props.location} history={this.props.history} match={this.props.match}/></Tab.Pane> }
                ]} />
            </div>)
    }
}

export default ApiDetailsTab
