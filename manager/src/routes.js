'use strict'

import AppRegisterC from './Controllers/AppRegisterC'
import AppCfgC from './Controllers/AppCfgC'
import ApiListC from './Controllers/ApiListC'
import ApiRegisterC from './Controllers/ApiRegisterC'
import ApiDetailsTab from './Views/ApiDetailsTab'
import LoginC from './Controllers/LoginC'
import SignUpC from './Controllers/SignUpC'
import AppList from './Views/AppListTab'

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
  },
  {
    path: '/app/register',
    component: AppRegisterC
  },
  {
    path: '/app/details',
    component: AppCfgC
  },
  {
    path: '/app/apilist',
    component: ApiListC
  },

  {
    path: '/api/register',
    component: ApiRegisterC
  },
  {
    path: '/api/details',
    component: ApiDetailsTab
  },
  {
    path: '/signup',
    component: SignUpC
  }
]

export default routes
