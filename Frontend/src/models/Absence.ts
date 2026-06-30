import type { User } from './User'

export type AbsenceStatus = 'pending' | 'approved' | 'rejected'

export interface Absence {
  id: number
  documentId: string
  startDate: string
  endDate: string | null
  reason: string | null
  absence_status: AbsenceStatus
  user: User
}

export interface AbsenceCreatePayload {
  startDate: string
  endDate: string | null
  reason: string | null
  user?: number
  delegateUserId?: number
}

export interface AbsenceDelegation {
  id: number
  startDate: string
  endDate: string
  isActive: boolean
  sourceAbsenceDocumentId: string
  adminUser: User
  delegateUser: User
}

export interface AbsenceDelegationStatus {
  canManageAbsences: boolean
  isDelegatedManager: boolean
  activeDelegation: AbsenceDelegation | null
  activeOwnedDelegations: AbsenceDelegation[]
}
