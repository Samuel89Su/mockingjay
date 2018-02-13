import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import { appListC, AppRoutes } from '../src/components/appListC'
import Layout from './components/layout'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
        <Router history={browserHistory}>
            <Layout>
                <Route exact path='/' component={appListC}></Route>
                {
                    AppRoutes.map((route, index) => {
                        return <Route key={index} path={route.path} component={route.component} ></Route>
                    })
                }
            </Layout>
		</Router>
	</Provider>),
	document.getElementById('root')
)
