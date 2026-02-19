import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserService } from '@/services/userService'
import type { Role, User } from '@/models/User'
import { Roles } from '@/router/Roles'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const roles = ref<Role[]>([])

  const fetchRoles = async () => {
    try {
      const response = await UserService.GetAvailableRoles()
      roles.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await UserService.GetUsers(1, 10)
      users.value = response.data
    } catch (error) {
      throw error
    }
  }

  const fetchUserById = async (id: number) => {
    try {
      const response = await UserService.GetUserById(id)
      selectedUser.value = response.data
    } catch (error) {
      throw error
    }
  }

  const getRoleSeverity = (roleName: string) => {
    switch (roleName) {
      case Roles.ADMIN:
        return 'danger'
      case Roles.VOLUNTEER:
        return 'warn'
      case Roles.USER:
        return 'info'
      default:
        return 'success'
    }
  }

  return {
    users,
    selectedUser,
    roles,
    fetchRoles,
    fetchUsers,
    fetchUserById,
    getRoleSeverity,
  }
})
