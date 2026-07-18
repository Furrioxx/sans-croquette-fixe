import type { Absence } from './Absence'

export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
  blocked: boolean
  confirmed: boolean
  role: Role
  newsletterOptIn: boolean
  absences?: Absence[]
}

export interface Role {
  id: number
  name: string
  type: string
}

export interface UserWithToken {
  user: User
  jwt: string
}

export interface UserLogin {
  identifier: string
  password: string
}

export interface UserPost {
  username: string
  email: string
  password: string | null
  newsletterOptIn: boolean
}

export interface UserPostPutAdmin extends UserPost {
  id: number | null
  confirmed: boolean
  blocked: boolean
  role: number
}
