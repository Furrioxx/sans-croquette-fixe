export interface AnalyticsSummary {
  cats: {
    total: number
    adopted: number
    fostered: number
    sheltered: number
  }
  donations: {
    count: number
    amount: number
  }
  blogPosts: {
    total: number
    published: number
  }
  adoptionRequests: {
    total: number
    byStatus: {
      pending: number
      in_review: number
      approved: number
      rejected: number
    }
  }
}
