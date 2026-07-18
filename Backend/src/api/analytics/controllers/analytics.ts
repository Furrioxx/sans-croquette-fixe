import type { Core } from '@strapi/strapi'

const CAT_UID = 'api::cat.cat' as any
const DONATION_UID = 'api::donation.donation' as any
const BLOG_POST_UID = 'api::blog-post.blog-post' as any
const ADOPTION_REQUEST_UID = 'api::adoption-request.adoption-request' as any

const countDocuments = (strapi: Core.Strapi, uid: any, where = {}) => {
  return strapi.db.query(uid).count({ where })
}

const sumCompletedDonations = async (strapi: Core.Strapi) => {
  const result = await strapi.db.connection('donations')
    .where({ status: 'completed' })
    .sum({ total: 'amount' })
    .first()

  return Number(result?.total ?? 0)
}

const countAdoptionRequestsByStatus = async (strapi: Core.Strapi) => {
  const statuses = ['pending', 'in_review', 'approved', 'rejected']
  const entries = await Promise.all(
    statuses.map(async (status) => [
      status,
      await countDocuments(strapi, ADOPTION_REQUEST_UID, {
        processingStatus: status,
        publishedAt: { $notNull: true },
      }),
    ]),
  )

  return Object.fromEntries(entries)
}

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async summary(ctx) {
    const [
      totalCats,
      adoptedCats,
      fosteredCats,
      shelteredCats,
      completedDonations,
      donationAmount,
      totalBlogPosts,
      publishedBlogPosts,
      totalAdoptionRequests,
      adoptionRequestsByStatus,
    ] = await Promise.all([
      countDocuments(strapi, CAT_UID, { publishedAt: { $notNull: true } }),
      countDocuments(strapi, CAT_UID, { catStatus: 'adopte', publishedAt: { $notNull: true } }),
      countDocuments(strapi, CAT_UID, { catStatus: 'en_famille_accueil', publishedAt: { $notNull: true } }),
      countDocuments(strapi, CAT_UID, { catStatus: 'en_refuge', publishedAt: { $notNull: true } }),
      countDocuments(strapi, DONATION_UID, { status: 'completed' }),
      sumCompletedDonations(strapi),
      countDocuments(strapi, BLOG_POST_UID),
      countDocuments(strapi, BLOG_POST_UID, { publishedAt: { $notNull: true } }),
      countDocuments(strapi, ADOPTION_REQUEST_UID, { publishedAt: { $notNull: true } }),
      countAdoptionRequestsByStatus(strapi),
    ])

    ctx.body = {
      data: {
        cats: {
          total: totalCats,
          adopted: adoptedCats,
          fostered: fosteredCats,
          sheltered: shelteredCats,
        },
        donations: {
          count: completedDonations,
          amount: donationAmount,
        },
        blogPosts: {
          total: totalBlogPosts,
          published: publishedBlogPosts,
        },
        adoptionRequests: {
          total: totalAdoptionRequests,
          byStatus: adoptionRequestsByStatus,
        },
      },
    }
  },
})
