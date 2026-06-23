export default {
  routes: [
    {
      method: 'GET',
      path: '/blog-posts/admin',
      handler: 'api::blog-post.blog-post.findAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'GET',
      path: '/blog-posts/admin/:documentId',
      handler: 'api::blog-post.blog-post.findOneAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'POST',
      path: '/blog-posts/admin',
      handler: 'api::blog-post.blog-post.createAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'PUT',
      path: '/blog-posts/admin/:documentId',
      handler: 'api::blog-post.blog-post.updateAdmin',
      config: {
        auth: false,
        policies: ['global::is-blog-editor'],
      },
    },
    {
      method: 'DELETE',
      path: '/blog-posts/admin/:documentId',
      handler: 'api::blog-post.blog-post.deleteAdmin',
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
      path: '/blog-posts/view/:identifier',
      handler: 'api::blog-post.blog-post.findOnePublic',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/blog-posts',
      handler: 'api::blog-post.blog-post.findPublic',
      config: {
        auth: false,
      },
    },
  ],
}
