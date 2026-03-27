import { axiosInstance } from './axiosInsance'

const API_URL = '/cat-moods'

export const CatMoodService = {
  GetAllCatMoods: async () => {
    return await axiosInstance.get(`${API_URL}`)
  },
}
