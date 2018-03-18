'use strict'

import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reducers from './reducers'

import Loadable from 'react-loadable'
import { AppRoutes } from './components/AppListC'
import { AppListC } from './components/AppListC'
import Layout from './components/Layout'
import '../semantic/dist/semantic.min.css'
import Loading from './components/Loading'

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  applyMiddleware(thunk, middleware)
)

// const AppListC = Loadable({
//   loader: () => import('./components/AppListC').AppListC,
//   loading: Loading
// })

ReactDOM.render(
	(<Provider store={store}>
        <ConnectedRouter history={history}>
            <Layout>
                <Route exact path='/' component={AppListC} />
                {
                    AppRoutes.map((route, index) => {
                        return <Route key={index} path={route.path} component={route.component} />
                    })
                }
            </Layout>
		</ConnectedRouter>
	</Provider>),
	document.getElementById('root')
)
