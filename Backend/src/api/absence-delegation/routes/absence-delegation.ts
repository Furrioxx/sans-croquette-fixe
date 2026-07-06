export default {
  routes: [
    {
      method: 'GET',
      path: '/absence-delegations/status',
      handler: 'api::absence-delegation.absence-delegation.getMyStatus',
    },
    {
      method: 'PUT',
      path: '/absence-delegations/:id/deactivate',
      handler: 'api::absence-delegation.absence-delegation.deactivate',
    },
  ],
}
