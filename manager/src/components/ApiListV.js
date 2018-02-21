import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import '../styles/apiList.scss'
import { Table, Header, Button, Pagination } from 'semantic-ui-react'

class ApiListV extends Component {
    constructor(props) {
        super(props)

        this.register = this.register.bind(this)
        this.handlePaginationChange = this.handlePaginationChange.bind(this)

        this.state = { activePage: 1 }
    }    

    componentWillMount() {
        let search = (this.props.location && this.props.location.search)
                        ? this.props.location.search
                        : window.location.search
        let query = queryString.parse(search)
        this.setState({ query: query })
        query.pageNum = this.state.activePage - 1
        this.props.fetchData(query)
    }

    register(event, data) {
        this.props.history.push('/api/register')
    }

    handlePaginationChange(e, data) {
        let query = this.state.query
        query.pageNum = data.activePage - 1
        this.setState({ 
            activePage: data.activePage
            })
        this.props.fetchData(query)
    }

    render() {
        let pagedApis = this.props.pagedApis
        let list = this.props.pagedApis.records
        if (!list || !(list instanceof Array) ) {
            return (<div>has no state</div>)
        }

        let detailsQuery = Object.assign({}, this.state.query)
        delete detailsQuery.pageNum
        let detailsSearch = '?' + queryString.stringify(detailsQuery)

        return (
            <div id='api-list'>
                <Header as='h2'>Apis</Header>
                <div>
                    <Button onClick={()=>{this.props.history.push('/')}} >Back to Apps</Button>
                    <Button onClick={this.register} >Register</Button>
                </div>

                <div>
                    <Table>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
                                <Table.HeaderCell>Method</Table.HeaderCell>
                                <Table.HeaderCell>Validate</Table.HeaderCell>
                                <Table.HeaderCell>Forward</Table.HeaderCell>
                                <Table.HeaderCell>Path</Table.HeaderCell>
                                <Table.HeaderCell>Desc</Table.HeaderCell>
                                <Table.HeaderCell>Details</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {
                                list.map((api, index) => {
                                    let cacheKey = api.path.replace(/\//g, '_')
                                    if (cacheKey.startsWith('_')) {
                                        cacheKey = cacheKey.substr(1)
                                    }
                                    return (
                                        <Table.Row key={ index }>
                                            <Table.Cell>{ api.id }</Table.Cell>
                                            <Table.Cell>{ api.name }</Table.Cell>
                                            <Table.Cell>{ api.method }</Table.Cell>
                                            <Table.Cell>{ api.validate.toString() }</Table.Cell>
                                            <Table.Cell>{ api.forward.toString() }</Table.Cell>
                                            <Table.Cell>{ api.path }</Table.Cell>
                                            <Table.Cell>{ api.description }</Table.Cell>
                                            <Table.Cell><Link to={`/api/details${detailsSearch}&id=${api.id}`}>details</Link></Table.Cell>
                                        </Table.Row>)
                                })
                            }
                        </Table.Body>
                    </Table>

                    <div>
                        <Pagination floated='right' activePage={ this.state.activePage } onPageChange={ this.handlePaginationChange } totalPages={ pagedApis.pageCnt } />
                    </div>
                </div>
                
            </div>
        );
    }
}

export default ApiListV