import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import InventoryAPI from './InventoryAPI'

class ApiList extends Component {
    constructor(props) {
        super(props)

        this.state = {
            list: []
        }
    }

    componentDidMount() {
        fetch(InventoryAPI.apiList)
        .then(res => {
            var contentType = res.headers.get('content-type')
            if (!res.ok) {
              return []
            } else if (!contentType || !contentType.includes('application/json')) {
              return []
            } else if (contentType && contentType.includes('application/json')) {
              return res.json()
            }
        })
        .then(retData => {
            if (retData.code !== 0) {
              return
            } else {
              if (retData.data && retData.data.length > 0) {
                let dummy = []
                retData.data.forEach(app => {
                    dummy.push(app)
                })

                this.setState({ list: dummy })
              }
            }
          })
        .catch(ex => {
            console.log(ex);
        })
    }

    render() {
        return (
            <div id='api-list'>
                <h2>App List</h2>
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
                            this.state.list.map((app, index) => {
                                return (
                                    <tr key={ index }>
                                        <td>{ app.id }</td>
                                        <td>{ app.name }</td>
                                        <td>{ app.desc }</td>
                                        <td><Link to='/app/details'>details</Link></td>
                                        <td><Link to='/app/apilist'>api list</Link></td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

const ApiRoutes = [
    { path: '/api/register' },
    { path: '/api/details' },
    { path: '/api/schema' },
    { path: '/api/mockcfg' }
]

export { ApiList, ApiRoutes }