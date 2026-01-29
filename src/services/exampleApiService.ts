import { axiosInstance } from './axiosInsance'

const API_URL = '/example'

export const ExampleService = {
  GetExamples: async (page: number, limit: number | null) => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        page: page,
        limit: limit,
      },
    })
  },

  SearchExamples: async (query: string, limit: number | null) => {
    return await axiosInstance.get(`${API_URL}/search`, {
      params: {
        nom: query,
        limit: limit,
      },
    })
  },²

  PostExample: async (data: string) => {
    return await axiosInstance.post(`${API_URL}`, data)
  },
}
