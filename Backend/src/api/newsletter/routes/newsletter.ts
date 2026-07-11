export default {
  routes: [
    {
      method: "GET",
      path: "/newsletter/unsubscribe",
      handler: "api::newsletter.newsletter.unsubscribe",
      config: {
        auth: false,
      },
    },
  ],
};
