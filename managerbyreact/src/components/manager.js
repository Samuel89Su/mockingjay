import '../styles/manager.scss'
import React, { Component } from 'react'
import 'normalize.css/normalize.css'
import { AppList, AppRoutes } from './appList'

import { BrowserRouter as Router, Route } from 'react-router-dom';

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
            
                    <Route exact path='/' component={AppList}></Route>
                    {
                        AppRoutes.map((route, index) => {
                            return <Route key={index} path={route.path} component={route.component} ></Route>
                        })
                    }

                </div>
            </Router>
        );
    }

    componentDidMount() {

    }
}

export default Manager;
