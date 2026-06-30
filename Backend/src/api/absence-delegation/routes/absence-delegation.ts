export default {
  routes: [
    {
      method: 'GET',
      path: '/absence-delegations/status',
      handler: 'api::absence-delegation.absence-delegation.getMyStatus',
      config: {
        policies: ['global::is-volunteer-or-admin'],
      },
    },
    {
      method: 'PUT',
      path: '/absence-delegations/:id/deactivate',
      handler: 'api::absence-delegation.absence-delegation.deactivate',
      config: {
        policies: ['global::is-admin'],
      },
    },
  ],
}
