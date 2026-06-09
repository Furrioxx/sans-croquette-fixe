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
}

