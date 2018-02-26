import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appList.scss'
import { Table, Header, Button, Pagination, Search } from 'semantic-ui-react'

class AppListV extends Component {
    constructor(props) {
        super(props)

        this.register = this.register.bind(this)
        this.handlePaginationChange = this.handlePaginationChange.bind(this)
        this.search = this.search.bind(this)

        this.state = { activePage: 1 }
    }

    componentWillMount() {
        if (!this.props.pagedApps || this.props.pagedApps.records
            || !(this.props.pagedApps.records instanceof Array)
            || this.props.pagedApps.records.length === 0) {
            this.props.fetchData({ pageNum: this.state.activePage -1 })
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({isSearching: false})
    }

    register(event, data) {
        this.props.history.push('/app/register')
    }

    handlePaginationChange(e, data) {
        this.setState({ 
            activePage: data.activePage
            })
        this.props.fetchData({ pageNum: data.activePage -1, partialName: this.state.partialName })
    }

    search(e, data) {
        this.setState({isSearching: true, partialName: data.value})

        this.props.fetchData({ pageNum: this.state.activePage -1, partialName: data.value })
    }

    render() {
        let pagedResult = this.props.pagedApps
        let list = this.props.pagedApps.records
        if (!list || !(list instanceof Array) ) {
            return (<div>has no state</div>)
        }

        let { isSearching, partialName } = this.state

        return (
            <div id='app-list'>
                <Header as='h2'>应用</Header>
                <div>
                    <Button onClick={this.register} >创建应用</Button>
                    <div className='div-search'>
                        <Search loading={isSearching}
                            open={false}
                            onSearchChange={this.search}
                            value={partialName}
                            className='search'
                            placeholder='名称模糊搜索' />
                    </div>
                </div>
                
                <div>
                    <Table>
                        <Table.Header fullWidth>
                            <Table.Row>
                                <Table.HeaderCell>ID</Table.HeaderCell>
                                <Table.HeaderCell>名称</Table.HeaderCell>
                                <Table.HeaderCell>描述</Table.HeaderCell>
                                <Table.HeaderCell>代理</Table.HeaderCell>
                                <Table.HeaderCell>详情</Table.HeaderCell>
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
                                    <Table.Cell><Link to={`/app/details?appId=${app.id}&appName=${app.name}`}>详情</Link></Table.Cell>
                                    <Table.Cell><Link to={`/app/apilist?appId=${app.id}&appName=${app.name}`}>api 列表</Link></Table.Cell>
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
