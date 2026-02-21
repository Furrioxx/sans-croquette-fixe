import type { UserPostPutAdmin } from '@/models/User'
import { axiosInstance } from './axiosInsance'

const API_URL = '/users'

export const UserService = {
  GetAvailableRoles: async () => {
    return await axiosInstance.get('/user-roles/available')
  },
  GetUsers: async (page: number, limit: number | null) => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': limit,
        populate: 'role',
        'sort[0]': 'role.type:asc',
      },
    })
  },
  GetUserById: async (id: number) => {
    return await axiosInstance.get(`${API_URL}/${id}`, {
      params: {
        populate: 'role',
      },
    })
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
}
