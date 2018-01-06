import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import apiInventoryRoutes from '@/components/ApiInventory/routes'

Vue.use(Router)

var baseRoutes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }
]

var allRoutes = baseRoutes.concat(apiInventoryRoutes)

export default new Router({
  routes: allRoutes
})
