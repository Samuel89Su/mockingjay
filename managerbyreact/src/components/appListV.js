import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../styles/appList.scss'

class appListV extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        if (!this.props.appList 
            || !(this.props.appList instanceof Array)
            || this.props.appList.length === 0) {
            this.props.onMounted()
        }
    }

    render() {
        let list = this.props.appList

        return (
            <div id='app-list'>
                <h2>App List</h2>
                <Link to='/app/register'>Register</Link>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Desc</th>
                            <th>Details</th>
                            <th>API List</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            list.map((app, index) => {
                                return (
                                    <tr key={ index }>
                                        <td>{ app.id }</td>
                                        <td>{ app.name }</td>
                                        <td>{ app.desc }</td>
                                        <td><Link to={'/app/details?appId='+app.id}>details</Link></td>
                                        <td><Link to={`/app/apilist?appId=${app.id}&appName=${app.name}`}>api list</Link></td>
                                    </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default appListV