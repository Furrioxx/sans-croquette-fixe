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
        path: 'donate',
        name: RouteNames.DONATE,
        component: () => import('../views/Donate.vue'),
      },
      {
        path: 'about-us',
        name: RouteNames.ABOUT_US,
        component: () => import('../views/AboutUs.vue'),
      },
      {
        path: 'mentions-legales',
        name: RouteNames.LEGAL_NOTICES,
        component: () => import('../views/LegalNotices.vue'),
      },
      {
        path: 'distribution-de-croquettes',
        name: RouteNames.FOOD_DISTRIBUTION,
        component: () => import('../views/FoodDistribution.vue'),
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
      {
        path: 'adopt',
        name: RouteNames.ADOPT,
        component: () => import('../views/Adopt.vue'),
      },
      {
        path: 'trouver-mon-chat-ideal',
        name: RouteNames.ADOPT_GUIDE,
        component: () => import('../views/AdoptGuide.vue'),
      },
      {
        path: 'adopt/:documentId',
        name: RouteNames.ADOPT_DETAIL,
        component: () => import('../views/AdoptDetail.vue'),
      },
      {
        path: 'adopt/:documentId/formulaire',
        name: RouteNames.ADOPTION_FORM,
        component: () => import('../views/AdoptionRequest.vue'),
      },
      {
        path: 'mes-demandes-adoption',
        name: RouteNames.USER_ADOPTION_REQUESTS,
        meta: {
          requiresAuth: true,
        },
        component: () => import('../views/UserAdoptionRequests.vue'),
      },
      {
        path: 'discover',
        name: RouteNames.DISCOVER,
        component: () => import('../views/Discover.vue'),
      },
      {
        path: 'discover/likes',
        name: RouteNames.DISCOVER_LIKES,
        component: () => import('../views/MyLikes.vue'),
      },
      {
        path: 'blog',
        name: RouteNames.BLOG,
        component: () => import('../views/Blog.vue'),
      },
      {
        path: 'blog/:identifier',
        name: RouteNames.BLOG_DETAIL,
        component: () => import('../views/BlogDetail.vue'),
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
        path: 'cats',
        meta: {
          requiredRoles: [Roles.ADMIN],
        },
        component: () => import('../views/Admin/Cats.vue'),
        name: RouteNames.DASHBOARD_CATS,
      },
      {
        path: 'users',
        meta: {
          requiredRoles: [Roles.ADMIN],
        },
        component: () => import('../views/Admin/Users.vue'),
        name: RouteNames.DASHBOARD_USERS,
      },
      {
        path: 'blog',
        component: () => import('../views/Admin/BlogPosts.vue'),
        name: RouteNames.DASHBOARD_BLOG,
      },
      {
        path: 'analytics',
        meta: {
          requiredRoles: [Roles.ADMIN],
        },
        component: () => import('../views/Admin/Analytics.vue'),
        name: RouteNames.DASHBOARD_ANALYTICS,
      },
      {
        path: 'absences',
        component: () => import('../views/Admin/Absences.vue'),
        name: RouteNames.DASHBOARD_ABSENCES,
      },
      {
        path: 'tarifications',
        meta: {
          requiredRoles: [Roles.ADMIN],
        },
        component: () => import('../views/Admin/Tarifications.vue'),
        name: RouteNames.DASHBOARD_TARIFICATIONS,
      },
      {
        path: 'adoption-requests',
        component: () => import('../views/Admin/AdoptionRequests.vue'),
        name: RouteNames.DASHBOARD_ADOPTION_REQUESTS,
      },
      {
        path: 'conversations',
        component: () => import('../views/Admin/Conversations.vue'),
        name: RouteNames.DASHBOARD_CONVERSATIONS,
      },
      {
        path: 'settings',
        meta: {
          requiredRoles: [Roles.ADMIN],
        },
        component: () => import('../views/Admin/Settings.vue'),
        name: RouteNames.DASHBOARD_SETTINGS,
      },
    ],
  },
  {
    path: '/unauthorized',
    component: () => import('../layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: RouteNames.UNAUTHORIZED,
        component: () => import('../views/Unauthorized.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../layout/AppLayout.vue'),
    children: [
      {
        path: '',
        name: RouteNames.NOT_FOUND,
        component: () => import('../views/NotFound.vue'),
      },
    ],
  },
]

export default routes
