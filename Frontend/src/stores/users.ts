import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserService } from '@/services/userService'
import type { Role, User, UserPostPutAdmin } from '@/models/User'
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

  const toggleBlockUser = async (id: number, isBlocked: boolean) => {
    try {
      if (isBlocked) {
        await UserService.UnblockUser(id)
      } else {
        await UserService.BlockUser(id)
      }
    } catch (error) {
      throw error
    }
  }

  const addUserAdmin = async (user: UserPostPutAdmin) => {
    try {
      await UserService.AddUserAdmin(user)
    } catch (error) {
      throw error
    }
  }

  const updateUserAdmin = async (user: UserPostPutAdmin) => {
    try {
      await UserService.UpdateUserAdmin(user)
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
    toggleBlockUser,
    addUserAdmin,
    updateUserAdmin,
    getRoleSeverity,
  }
})
