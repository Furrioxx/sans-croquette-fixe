export default ({ env }) => ({
  "users-permissions": {
    config: {
      jwtManagement: "legacy-support",
      jwt: {
        expiresIn: "7d", // Traditional JWT expiry
      },
      register: {
        allowedFields: ["newsletterOptIn"],
      },
    },
  },
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST"),
        port: env.int("SMTP_PORT", 587),
        secure: env.bool("SMTP_SECURE", false),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("SMTP_FROM_ADDRESS"),
        defaultReplyTo: env("SMTP_REPLY_TO_ADDRESS", env("SMTP_FROM_ADDRESS")),
      },
    },
  },
});
