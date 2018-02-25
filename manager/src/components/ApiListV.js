import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import '../styles/apiList.scss'
import { Table, Header, Button, Pagination, Search } from 'semantic-ui-react'

class ApiListV extends Component {
    constructor(props) {
        super(props)

        this.register = this.register.bind(this)
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.search = this.search.bind(this)

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

    componentWillReceiveProps(nextProps) {
        this.setState({isSearching: false})
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

    search(e, data) {
        this.setState({isSearching: true, partialName: data.value})

        this.props.fetchData({ ...this.state.query, partialName: data.value })
    }

    render() {
        let pagedApis = this.props.pagedApis
        let list = this.props.pagedApis.records
        if (!list || !(list instanceof Array) ) {
            return (<div>has no state</div>)
        }

        let { isSearching, partialName } = this.state

        let detailsQuery = Object.assign({}, this.state.query)
        delete detailsQuery.pageNum
        let detailsSearch = '?' + queryString.stringify(detailsQuery)

        return (
            <div id='api-list'>
                <Header as='h2'>API</Header>
                <div>
                    <Button onClick={()=>{this.props.history.push('/')}} >返回应用列表</Button>
                    <Button onClick={this.register} >添加</Button>
                    <div className='div-search'>
                        <Search loading={isSearching}
                            open={false}
                            onSearchChange={this.search}
                            value={partialName}
                            className='search' />
                    </div>
                </div>

                <div>
                    <Table>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>方法</Table.HeaderCell>
                                <Table.HeaderCell>验证数据</Table.HeaderCell>
                                <Table.HeaderCell>代理</Table.HeaderCell>
                                <Table.HeaderCell>路径</Table.HeaderCell>
                                <Table.HeaderCell>描述</Table.HeaderCell>
                                <Table.HeaderCell>详情</Table.HeaderCell>
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