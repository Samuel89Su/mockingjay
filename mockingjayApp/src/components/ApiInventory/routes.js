import { join } from 'path'
import AppList from './AppList'
import ApiList from './ApiList'
import ApiConfig from './ApiConfig'
import AppRegister from './AppRegister'
import ApiEditor from './ApiEditor'
import ApiSchema from './ApiSchema'

var basePath = '/apiinventory'

export default [
  {
    path: basePath,
    name: 'applist',
    component: AppList
  },
  {
    path: join(basePath, '/appregister'),
    name: 'appregister',
    component: AppRegister
  },
  {
    path: join(basePath, '/apilist'),
    name: 'apilist',
    component: ApiList
  },
  {
    path: join(basePath, '/apieditor'),
    name: 'apieditor',
    component: ApiEditor
  },
  {
    path: join(basePath, '/apiSchema'),
    name: 'apischema',
    component: ApiSchema
  },
  {
    path: join(basePath, '/apiConfig'),
    name: 'apiconfig',
    component: ApiConfig
  }
]
