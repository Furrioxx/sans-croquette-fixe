import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserService } from '@/services/userService'
import type { User } from '@/models/User'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)

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

  return {
    users,
    selectedUser,
    fetchUsers,
    fetchUserById,
  }
})
