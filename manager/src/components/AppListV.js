import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appList.scss'
import { Table, Header, Button, Pagination } from 'semantic-ui-react'

class AppListV extends Component {
    constructor(props) {
        super(props)

        this.register = this.register.bind(this)
        this.handlePaginationChange = this.handlePaginationChange.bind(this)

        this.state = { activePage: 1 }
    }

    componentWillMount() {
        if (!this.props.pagedApps || this.props.pagedApps.records
            || !(this.props.pagedApps.records instanceof Array)
            || this.props.pagedApps.records.length === 0) {
            this.props.fetchData({ pageNum: this.state.activePage -1 })
        }
    }

    register(event, data) {
        this.props.history.push('/app/register')
    }

    handlePaginationChange(e, data) {
        this.setState({ 
            activePage: data.activePage
            })
        this.props.fetchData({ pageNum: data.activePage -1 })
    }

    render() {
        let pagedResult = this.props.pagedApps
        let list = this.props.pagedApps.records
        if (!list || !(list instanceof Array) ) {
            return (<div>has no state</div>)
        }

        return (
            <div id='app-list'>
                <Header as='h2'>Apps</Header>
                <div>
                    <Button onClick={this.register} >Register</Button>
                </div>
                
                <div>
                    <Table>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Description</Table.HeaderCell>
                                <Table.HeaderCell>Forward</Table.HeaderCell>
                                <Table.HeaderCell>Details</Table.HeaderCell>
                                <Table.HeaderCell>API List</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                        {  
                            list.map((app, index) => {
                                return (
                                <Table.Row key={index}>
                                    <Table.Cell>{ app.id }</Table.Cell>
                                    <Table.Cell>{ app.name }</Table.Cell>
                                    <Table.Cell>{ app.desc }</Table.Cell>
                                    <Table.Cell>{ app.apiForwardTarget }</Table.Cell>
                                    <Table.Cell><Link to={`/app/details?appId=${app.id}&appName=${app.name}`}>details</Link></Table.Cell>
                                    <Table.Cell><Link to={`/app/apilist?appId=${app.id}&appName=${app.name}`}>api list</Link></Table.Cell>
                                </Table.Row>)
                            })
                        }
                        </Table.Body>

                    </Table>
                    
                    <div>
                        <Pagination floated='right' activePage={ this.state.activePage } onPageChange={ this.handlePaginationChange } totalPages={ pagedResult.pageCnt } />
                    </div>
                </div>
            </div>
        )
    }
}

export default AppListV