import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ExampleService } from '@/services/exampleApiService'

export const useExampleApiStore = defineStore('example', () => {
  const examples = ref<string[]>([])

  const fetchExamples = async () => {
    try {
      const response = await ExampleService.GetExamples(1, 10)
      examples.value = response.data
    } catch (error) {
      throw error
    }
  }

  const postExample = async (data: string) => {
    try {
      const response = await ExampleService.PostExample(data)
      const exampleData: string[] = response.data
      examples.value = exampleData
    } catch (error) {
      throw error
    }
  }

  return {
    examples,
    fetchExamples,
    postExample,
  }
})
