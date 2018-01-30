import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducer from './reducers'
import withRedux from "next-redux-wrapper"
import AppListC from './components/AppListC'
import Layout from './components/Layout'

const buildStore = () => { return createStore(reducer, {}, applyMiddleware(thunk)) }

class Index extends Component {

    static getInitialProps({store, isServer, pathname, query}) {
        store.dispatch({type: 'FOO', payload: 'foo'});
        return {custom: 'custom'};
    }

    render() {
        return (
        <div>            
            
            <h1>Hello</h1>
            <div>Prop from Redux</div>
            <div>Prop from getInitialProps</div>
            <AppListC />
        </div>)
    }
}

// map state to props
const mapStateToProps = state => {
    return {
        foo: state.foo
    }
  }

export default withRedux(buildStore, mapStateToProps)(Index)
