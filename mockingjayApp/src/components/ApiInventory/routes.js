import { join } from 'path'
import AppList from './AppList'
import ApiList from './ApiList'
import ApiConfig from './ApiConfig'

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
    path: join(basePath, '/apiSchema'),
    name: 'apiSchema',
    component: ApiConfig
  },
  {
    path: join(basePath, '/apiConfig'),
    name: 'apiConfig',
    component: ApiConfig
  }
]
