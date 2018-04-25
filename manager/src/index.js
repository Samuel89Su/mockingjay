'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import reducers from './reducers'
import '../semantic/dist/semantic.min.css'
import './styles/index.scss'
import routes from './routes'
import DefaultLayout from './components/DefaultLayout'

const store = createStore(reducers, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
        <Router history={browserHistory}>
            <div>
                {
                    routes.map((route, index) => {
                        return <DefaultLayout key={index} {...route.options} path={route.path} component={route.component} />
                    })
                }
            </div>
		</Router>
	</Provider>),
	document.getElementById('root')
)
