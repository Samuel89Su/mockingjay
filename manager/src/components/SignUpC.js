'use strict'

import { connect } from 'react-redux'
import Loadable from 'react-loadable'
import Loading from './Loading'

const SignUpV = Loadable({
  loader: () => import('./SignUpV'),
  loading: Loading
})

// map state to props
const mapStateToProps = state => {
  return {
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
  }
}

// connect & export
const SignUpC = connect(mapStateToProps, mapDispatchToProps)(SignUpV)
export default SignUpC