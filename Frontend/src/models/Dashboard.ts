import type { AdoptionProcessingStatus } from './AdoptionRequest'

export interface DashboardTrendPoint {
  date: string
  submitted: number
}

export interface DashboardAdoptionPriority {
  type: 'adoption_request'
  documentId: string
  catNames: string[]
  fallbackAnimalName: string
  status: AdoptionProcessingStatus
  createdAt: string
  overdue: boolean
}

export interface DashboardAbsencePriority {
  type: 'absence'
  documentId: string
  volunteerName: string | null
  startDate: string
  endDate: string
}

export type DashboardPriority = DashboardAdoptionPriority | DashboardAbsencePriority

export interface DashboardRecentRequest {
  documentId: string
  catNames: string[]
  fallbackAnimalName: string
  status: AdoptionProcessingStatus
  createdAt: string
  linkedVolunteerName: string | null
}

export interface DashboardSummary {
  generatedAt: string
  scope: 'global' | 'assigned'
  capabilities: {
    canViewTeamStats: boolean
    canManageAbsences: boolean
  }
  cats: {
    total: number
    adoptable: number
    refuge: number
    foster: number
    inCare: number
    adopted: number
  }
  adoptionRequests: {
    total: number
    pending: number
    inReview: number
    overdue: number
  }
  conversations: {
    total: number
    activeLast7Days: number
  }
  absences: {
    pendingApproval: number
    activeToday: number
    upcomingMine: number
  }
  team: {
    activeVolunteers: number
    adopters: number
    blockedUsers: number
  } | null
  contentHealth: {
    draftBlogPosts: number
    catSheetsWithoutMedia: number
    catSheetsWithoutBackup: number
  } | null
  requestTrend: DashboardTrendPoint[]
  priorities: DashboardPriority[]
  recentRequests: DashboardRecentRequest[]
}
