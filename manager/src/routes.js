'use strict'

import AppRegisterC from './Controllers/AppRegisterController'
import ApiList from './Controllers/ApiListController'
import ApiRegisterC from './Controllers/ApiRegisterController'
import ApiDetailsTab from './Views/ApiDetailsTab'
import LoginC from './Controllers/LoginController'
import SignUpC from './Controllers/SignUpController'
import AppList from './Views/AppListTab'
import AppDetailsTab from './Views/AppDetailsTab'
import AtomEditor from './Components/AtomEditor'
import JsonSchemaEditor from './Views/JsonSchemaEditor'

const routes = [{
    path: '/',
    options: {
      exact: true,
      hideHeader: true
    },
    component: LoginC
  }, {
    path: '/login',
    component: LoginC,
    options: {
      hideHeader: true
    }
  }, {
    path: '/app',
    options: {
      exact: true
    },
    component: AppList
  }, {
    path: '/app/list',
    options: {
      exact: true
    },
    component: AppList
  },{
    path: '/app/register',
    component: AppRegisterC
  },{
    path: '/app/details',
    component: AppDetailsTab
  },{
    path: '/app/apilist',
    component: ApiList
  },{
    path: '/api/register',
    component: ApiRegisterC
  },{
    path: '/api/details',
    component: ApiDetailsTab
  },{
    path: '/signup',
    component: SignUpC
  },{
    path: '/atomeditor',
    component: JsonSchemaEditor
  }
]

export default routes
