import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import '../styles/apiList.scss'

class apiListV extends Component {
    constructor(props) {
        super(props)

        this.state = {}
    }    

    componentDidMount() {
        this.props.onMounted(this.props.location.search)
        let query = queryString.parse(this.props.location.search)
        this.setState({ appName: query.appName })
    }

    render() {
        let list = this.props.apiList
        return (
            <div id='api-list'>
                <h2>Api List</h2>
                <div className="operations">
                    <Link to='/'>Back To List</Link>
                    <Link to='/api/register'>Register</Link>
                </div>
                <table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Method</th>
                        <th>Validate</th>
                        <th>Forward</th>
                        <th>Path</th>
                        <th>Desc</th>
                        <th>Details</th>
                        <th>Schema</th>
                        <th>MockCfg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((api, index) => {
                                let cacheKey = api.path.replace(/\//g, '_')
                                if (cacheKey.startsWith('_')) {
                                    cacheKey = cacheKey.substr(1)
                                }
                                return (
                                    <tr key={ index }>
                                        <td>{ api.id }</td>
                                        <td>{ api.name }</td>
                                        <td>{ api.method }</td>
                                        <td>{ api.validate }</td>
                                        <td>{ api.forward }</td>
                                        <td>{ api.path }</td>
                                        <td>{ api.description }</td>
                                        <td><Link to={`/api/details?appName=${this.state.appName}&id=${api.id}`}>details</Link></td>
                                        <td><Link to={`/api/schema?appName=${this.state.appName}&id=${api.id}`}>schema</Link></td>
                                        <td><Link to={`/api/mockcfg?appName=${this.state.appName}&id=${api.id}`}>mockcfg</Link></td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default apiListV