import { join } from 'path'
import AppList from './AppList'
import ApiList from './ApiList'
import ApiDetails from './ApiDetails'

var basePath = '/apiinventory'

export default [
  {
    path: basePath,
    name: 'app list',
    component: AppList
  },
  {
    path: join(basePath, '/apilist'),
    name: 'api list',
    component: ApiList
  },
  {
    path: join(basePath, '/apidetails'),
    name: 'api details',
    component: ApiDetails
  }
]
