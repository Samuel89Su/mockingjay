'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import ControlPanel from './components/ControlPanel'
import Layout from './components/Layout'
import reducers from './reducers'
import '../semantic/dist/semantic.min.css'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
        <Router history={browserHistory}>
            <Layout>
                <Route exact path='/' component={ ControlPanel }></Route>
            </Layout>
		</Router>
	</Provider>),
	document.getElementById('root')
)
