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
    component: () => import('../layout/AdminLayout.vue'),
    redirect: '/dashboard/home',
    children: [
      {
        path: 'home',
        component: () => import('../views/Admin/Home.vue'),
        name: RouteNames.DASHBOARD,
      },
      {
        path: 'users',
        component: () => import('../views/Admin/Users.vue'),
        name: RouteNames.DASHBOARD_USERS,
      },
      {
        path: 'analytics',
        component: () => import('../views/Admin/Analytics.vue'),
        name: RouteNames.DASHBOARD_ANALYTICS,
      },
      {
        path: 'settings',
        component: () => import('../views/Admin/Settings.vue'),
        name: RouteNames.DASHBOARD_SETTINGS,
      },
    ],
  },
]

export default routes
