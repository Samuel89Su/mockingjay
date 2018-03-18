'use strict'

import React from "react"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Loadable from 'react-loadable'
import Loading from './Loading'

const Home = Loadable({
  loader: ()=>import('./Home'),
  LoadingComponent: Loading,
})
const About = Loadable({
  loader: ()=>import('./About'),
  LoadingComponent: Loading,
})
const Topics = Loadable({
  loader: ()=>import('./Topics'),
  LoadingComponent: Loading,
})

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/topics">Topics</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/topics" component={Topics} />
      </div>
    </Router>
  )
}
