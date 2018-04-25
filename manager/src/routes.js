'use strict'

import AppRegisterC from './components/AppRegisterC'
import AppCfgC from './components/AppCfgC'
import ApiListC from './components/ApiListC'
import ApiRegisterC from './components/ApiRegisterC'
import ApiDetailsTab from './components/ApiDetailsTab'
import LoginC from './components/LoginC'
import SignUpC from './components/SignUpC'
import AppList from './components/AppListTab'

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
