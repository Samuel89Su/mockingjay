'use strict'
import React from 'react'
import Loadable from 'react-loadable'

const Loading = ()=>{return (<div>Loading...</div>)}

export default (view) => {
    return Loadable({
        loader: () => view,
        loading: Loading
      })
}