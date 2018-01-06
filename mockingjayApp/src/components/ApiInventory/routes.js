import { join } from 'path'
import AppList from './AppList'
import ApiList from './ApiList'
import ApiDetails from './ApiDetails'

var basePath = '/apiinventory'

export default [
  {
    path: basePath,
    name: 'applist',
    component: AppList
  },
  {
    path: join(basePath, '/apilist'),
    name: 'apilist',
    component: ApiList
  },
  {
    path: join(basePath, '/apidetails'),
    name: 'apidetails',
    component: ApiDetails
  }
]
