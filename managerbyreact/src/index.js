import React from 'react';
import ReactDOM from 'react-dom';
import Manager from './components/manager.js';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import managerApp from './reducers'

const store = createStore(managerApp, applyMiddleware(thunk))

ReactDOM.render(
	(<Provider store={store}>
		<Manager store={store} />
	</Provider>),
	document.getElementById('root')
);