import type { DashboardSummary } from '@/models/Dashboard'
import { axiosInstance } from './axiosInsance'

export const DashboardService = {
  getSummary() {
    return axiosInstance.get<{ data: DashboardSummary }>('/dashboard/summary')
  },
}
