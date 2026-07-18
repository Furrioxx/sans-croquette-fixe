import type { AnalyticsSummary } from '@/models/Analytics'
import { axiosInstance } from './axiosInsance'

export const AnalyticsService = {
  GetSummary: async () => {
    return await axiosInstance.get<{ data: AnalyticsSummary }>('/analytics/summary')
  },
}
