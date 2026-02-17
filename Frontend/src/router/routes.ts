import { Roles } from './Roles'
import { RouteNames } from './routeNames'

const routes = [
  {
    path: '/',
    redirect: '/home',
    component: () => import('../layout/AppLayout.vue'),
    children: [
      {
        path: 'home',
        name: RouteNames.HOME,
        component: () => import('../views/Home.vue'),
      },
      {
        path: 'login',
        name: RouteNames.LOGIN,
        component: () => import('../views/Auth/Login.vue'),
      },
      {
        path: 'register',
        name: RouteNames.REGISTER,
        component: () => import('../views/Auth/Register.vue'),
      },
    ],
  },
  {
    path: '/dashboard',
    meta: {
      requiresAuth: true,
      requiredRoles: [Roles.ADMIN, Roles.VOLUNTEER],
    },
    name: RouteNames.DASHBOARD,
    component: () => import('../layout/AdminLayout.vue'),
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        component: () => import('../views/Admin/Home.vue'),
      },
    ],
  },
]

export default routes
