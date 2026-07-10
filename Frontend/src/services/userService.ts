import type { UserPostPutAdmin } from '@/models/User'
import { axiosInstance } from './axiosInsance'
import { toStrapiQueryString } from '@/utils/strapiQuery'

const API_URL = '/users'

export const UserService = {
  GetVolunteers: async () => {
    return await axiosInstance.get('/user-roles/volunteers')
  },
  GetAvailableRoles: async () => {
    return await axiosInstance.get('/user-roles/available')
  },
  GetUsers: async (page: number, limit: number | null) => {
    const query = toStrapiQueryString({
      pagination: { page, pageSize: limit },
      populate: 'role',
      sort: ['role.type:asc'],
    })
    return await axiosInstance.get(`${API_URL}?${query}`)
  },
  GetUserById: async (id: number) => {
    const query = toStrapiQueryString({ populate: 'role' })
    return await axiosInstance.get(`${API_URL}/${id}?${query}`)
  },
  BlockUser: async (id: number) => {
    return await axiosInstance.put(`${API_URL}/${id}`, {
      blocked: true,
    })
  },
  UnblockUser: async (id: number) => {
    return await axiosInstance.put(`${API_URL}/${id}`, {
      blocked: false,
    })
  },
  AddUserAdmin: async (user: UserPostPutAdmin) => {
    const { id, ...userPost } = user
    return await axiosInstance.post(`${API_URL}`, userPost)
  },
  UpdateUserAdmin: async (user: UserPostPutAdmin) => {
    const { id, password, ...userPut } = user
    return await axiosInstance.put(`${API_URL}/${id}`, userPut)
  },
  UpdateUserRole: async (userId: number, roleId: number) => {
    return await axiosInstance.put(`/user-roles/${userId}`, { roleId })
  },
}
