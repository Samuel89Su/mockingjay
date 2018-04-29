'use strict'

import React from 'react'
import { Route } from 'react-router-dom'
import DefaultHeader from './DefaultHeader'
import '../styles/layout.scss'

const DefaultLayout = ({component: Component, ...rest}) => {
    return (
      <Route {...rest} render={props => (
          <div className='layout'>
            <DefaultHeader {...props} {...rest} />
            <div className='main'>
                <Component {...props} />
            </div>
        </div>
      )} />
    )
  }

export default DefaultLayout