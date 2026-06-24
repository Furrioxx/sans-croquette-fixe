export default {
  routes: [
    {
      method: 'GET',
      path: '/blog-categories/admin',
      handler: 'api::blog-category.blog-category.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'POST',
      path: '/blog-categories/admin',
      handler: 'api::blog-category.blog-category.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'PUT',
      path: '/blog-categories/admin/:id',
      handler: 'api::blog-category.blog-category.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'DELETE',
      path: '/blog-categories/admin/:id',
      handler: 'api::blog-category.blog-category.deleteAdmin',
      config: {
        auth: false,
        policies: [
          {
            name: 'global::is-blog-editor',
            config: {
              roles: ['Admin'],
            },
          },
        ],
      },
    },
    {
      method: 'GET',
      path: '/blog-categories',
      handler: 'api::blog-category.blog-category.findPublic',
      config: {
        auth: false,
      },
    },
  ],
}
