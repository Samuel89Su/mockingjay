import React, { Component } from 'react'
import Link from 'next/link'
// import '../styles/appList.scss'

class AppListV extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log('applist mounting')

        if (!this.props.appList 
            || !(this.props.appList instanceof Array)
            || this.props.appList.length === 0) {
            this.props.onMounted()
        }
    }

    render() {

        console.log('applist rendering')

        let list = this.props.appList

        return (
            <div id='app-list'>
                <h2>App List</h2>
                <Link href='/app/register'><a>Register</a></Link>
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
                                            <td><Link href={'/app/details?appId='+app.id}><a>details</a></Link></td>
                                            <td><Link href={`/app/apilist?appId=${app.id}&appName=${app.name}`}><a>api list</a></Link></td>
                                        </tr>)
                                })
                            }
                        </tbody>
                </table>
            </div>
        );
    }
}

export default AppListV