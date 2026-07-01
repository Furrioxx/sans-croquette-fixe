export default {
  routes: [
    {
      method: 'GET',
      path: '/user-profiles/me',
      handler: 'api::user-profile.user-profile.me',
    },
  ],
}
