'use strict'

import { Component } from 'react'
import withRedux from "next-redux-wrapper"
import BuildStore from "./BuildStore";
import AppList from './AppList'
import Layout from './components/Layout'

class Index extends Component {

    static async getInitialProps({store, isServer, pathname, query}) {
    }

    render() {
        return (
        <div>
            <Layout>
                <AppList />
            </Layout>
        </div>)
    }
}

export default withRedux(BuildStore)(Index)
