'use strict'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'

const BuildStore = () => { return createStore(reducer, {}, applyMiddleware(thunk)) }

export default BuildStore