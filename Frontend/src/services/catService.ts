import { axiosInstance } from './axiosInsance'

const API_URL = '/cats'

export const CatService = {
  GetAllCats: async () => {
    return await axiosInstance.get(`${API_URL}`)
  },
}
