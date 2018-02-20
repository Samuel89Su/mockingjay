import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import { AppListC, AppRoutes } from '../src/components/AppListC'
import Layout from './components/Layout'
import '../semantic/dist/semantic.min.css'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
        <Router history={browserHistory}>
            <Layout>
                <Route exact path='/' component={AppListC}></Route>
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
