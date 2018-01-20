import '../styles/manager.scss'
import 'normalize.css/normalize.css'
import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
//import { AppList, AppRoutes } from './appList'
import { appListC, AppRoutes } from '../containers/appListC'

class PageHeader extends Component {
    render() {
        return (
            <div className='page-header'>
                <h1>{ this.props.title }</h1>
            </div>
        );
    }
}

class Manager extends Component {
    render() {
        return (
            <Router>
                <div>
                    <PageHeader title='Mockingjay'></PageHeader>
            
                    <Route exact path='/' component={appListC}></Route>
                    {
                        AppRoutes.map((route, index) => {
                            return <Route key={index} path={route.path} component={route.component} ></Route>
                        })
                    }

                </div>
            </Router>
        );
    }
}

export default Manager;
