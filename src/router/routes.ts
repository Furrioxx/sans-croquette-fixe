import { RouteNames } from './routeNames'

const routes = [
  {
    path: '/',
    name: 'appLayout',
    component: () => import('../layout/AppLayout.vue'),
    redirect: '/home',
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
]

export default routes