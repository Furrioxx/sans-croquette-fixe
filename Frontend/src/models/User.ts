export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
  blocked: boolean
  confirmed: boolean
  role: Role
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
  password: string
}

export interface UserPostPutAdmin extends UserPost {
  confirmed: boolean
  blocked: boolean
  role: number
}
