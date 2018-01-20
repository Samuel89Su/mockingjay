import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/apiList.scss'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import { updateApiList } from '../actions'

class apiListV extends Component {
    constructor(props) {
        super(props)
    }    

    componentDidMount() {
        InventoryAPI.apiList.url += this.props.location.search
        this.props.dispatch(fetchRemote(InventoryAPI.apiList))
        .then(
            appList => this.props.dispatch(updateApiList(appList)),
            error => console.log(error))
    }

    render() {
        let list = this.props.apiList
        return (
            <div id='api-list'>
                <h2>Api List</h2>
                <Link to='/api/register'>Register</Link>
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
                            list.map((app, index) => {
                                return (
                                    <tr key={ index }>
                                        <td>{ app.apiId }</td>
                                        <td>{ app.name }</td>
                                        <td>{ app.method }</td>
                                        <td>{ app.validate }</td>
                                        <td>{ app.forward }</td>
                                        <td>{ app.path }</td>
                                        <td>{ app.description }</td>
                                        <td><Link to='/api/details'>details</Link></td>
                                        <td><Link to='/api/schema'>schema</Link></td>
                                        <td><Link to='/api/mockcfg'>mockcfg</Link></td>
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