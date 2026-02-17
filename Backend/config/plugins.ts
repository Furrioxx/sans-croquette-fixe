export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwtManagement: "legacy-support",
      jwt: {
        expiresIn: "7d", // Traditional JWT expiry
      },
    },
  },
});
