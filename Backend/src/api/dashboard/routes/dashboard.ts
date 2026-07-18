export default {
  routes: [
    {
      method: "GET",
      path: "/dashboard/summary",
      handler: "api::dashboard.dashboard.getSummary",
    },
  ],
};
