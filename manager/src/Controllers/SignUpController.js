'use strict'

import { connect } from 'react-redux'
import Loadable from '../Components/LoadableComponent'

const SignUpV = Loadable(import('../Views/SignUp'))

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