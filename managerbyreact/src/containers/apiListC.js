import { connect } from 'react-redux'
import apiListV from '../components/apiListV'


const ApiRoutes = [
    { path: '/api/register' },
    { path: '/api/details' },
    { path: '/api/schema' },
    { path: '/api/mockcfg' }
]

const mapStateToProps = state => {
  return {
    apiList: state.apiList
  }
}

const apiListC = connect(mapStateToProps, null)(apiListV)
export { apiListC, ApiRoutes };