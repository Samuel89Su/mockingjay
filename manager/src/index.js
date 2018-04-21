'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import Layout from './components/Layout'
import reducers from './reducers'
import '../semantic/dist/semantic.min.css'
import routes from './routes'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
        <Router history={browserHistory}>
            <Layout>
                {
                    routes.map((route, index) => {
                        return <Route key={index} {...route.options} path={route.path} component={route.component} ></Route>
                    })
                }
            </Layout>
		</Router>
	</Provider>),
	document.getElementById('root')
)
