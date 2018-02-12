import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import managerApp from './reducers'
import { BrowserRouter as Router, Route, browserHistory } from 'react-router-dom'
import { appListC, AppRoutes } from '../src/components/appListC'

const store = createStore(managerApp, applyMiddleware(thunk))

class PageHeader extends Component {
    render() {
        return (
            <div className='page-header'>
                <h1>{ this.props.title }</h1>
            </div>
        );
    }
}

ReactDOM.render(
	(<Provider store={store}>
		<Router history={browserHistory}>
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
	</Provider>),
	document.getElementById('root')
)
