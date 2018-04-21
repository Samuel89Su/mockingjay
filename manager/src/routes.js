import AppListC from './components/AppListC'
import AppRegisterC from './components/AppRegisterC'
import AppCfgC from './components/AppCfgC'
import ApiListC from './components/ApiListC'
import ApiRegisterC from './components/ApiRegisterC'
import ApiDetailsTab from './components/ApiDetailsTab'
import LoginC from './components/LoginC'
import SignUpC from './components/SignUpC'

const routes = [{
    path: '/',
    options: {
      exact: true
    },
    component: LoginC
  },{
    path: '/app',
    options: {
      exact: true
    },
    component: AppListC
  },{
    path: '/app/list',
    options: {
      exact: true
    },
    component: AppListC
  },
  {
    path: '/login',
    component: LoginC
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
