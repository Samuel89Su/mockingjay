'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import ControlPanel from './components/ControlPanel'
import Layout from './components/Layout'
import '../semantic/dist/semantic.min.css'

ReactDOM.render(
	(<Layout>
        <ControlPanel />
    </Layout>),
	document.getElementById('root')
)
