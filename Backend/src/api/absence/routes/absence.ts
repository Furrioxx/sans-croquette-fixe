export default {
  routes: [
    {
      method: "GET",
      path: "/absences",
      handler: "api::absence.absence.find",
      config: {
        policies: ["global::is-volunteer-or-admin"],
      },
    },
    {
      method: "GET",
      path: "/absences/:id",
      handler: "api::absence.absence.findOne",
      config: {
        policies: ["global::is-volunteer-or-admin"],
      },
    },
    {
      method: "POST",
      path: "/absences",
      handler: "api::absence.absence.create",
      config: {
        policies: ["global::is-volunteer-or-admin"],
      },
    },
    {
      method: "PUT",
      path: "/absences/:id",
      handler: "api::absence.absence.update",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "DELETE",
      path: "/absences/:id",
      handler: "api::absence.absence.delete",
      config: {
        policies: ["global::is-admin"],
      },
    },
  ],
};

