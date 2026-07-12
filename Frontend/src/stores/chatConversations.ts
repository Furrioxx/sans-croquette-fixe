import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatConversation } from '@/models/Chat'
import { ChatConversationService } from '@/services/chatConversationService'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'An unexpected error occurred'

export const useChatConversationsStore = defineStore('chatConversations', () => {
  const conversations = ref<ChatConversation[]>([])
  const currentConversation = ref<ChatConversation | null>(null)
  const loading = ref(false)
  const sending = ref(false)
  const error = ref<string | null>(null)

  const replaceConversationInList = (conversation: ChatConversation) => {
    const index = conversations.value.findIndex(
      (item) => item.documentId === conversation.documentId,
    )

    if (index === -1) {
      conversations.value.unshift(conversation)
    } else {
      conversations.value[index] = conversation
    }

    conversations.value.sort(
      (first, second) =>
        (second.lastMessageAt ? new Date(second.lastMessageAt).getTime() : 0) -
        (first.lastMessageAt ? new Date(first.lastMessageAt).getTime() : 0),
    )
  }

  const fetchConversations = async (silent = false) => {
    if (!silent) loading.value = true
    error.value = null

    try {
      const response = await ChatConversationService.getConversations()
      conversations.value = response.data.data
      return conversations.value
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      throw fetchError
    } finally {
      if (!silent) loading.value = false
    }
  }

  const fetchConversation = async (documentId: string, silent = false) => {
    if (!silent) loading.value = true
    error.value = null

    try {
      const response = await ChatConversationService.getConversation(documentId)
      currentConversation.value = response.data.data
      replaceConversationInList(response.data.data)
      return currentConversation.value
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      throw fetchError
    } finally {
      if (!silent) loading.value = false
    }
  }

  const fetchConversationForCatSheet = async (documentId: string, silent = false) => {
    if (!silent) loading.value = true
    error.value = null

    try {
      const response = await ChatConversationService.getConversationForCatSheet(documentId)
      currentConversation.value = response.data.data[0] ?? null
      return currentConversation.value
    } catch (fetchError) {
      currentConversation.value = null
      error.value = getErrorMessage(fetchError)
      throw fetchError
    } finally {
      if (!silent) loading.value = false
    }
  }

  const startConversation = async (catSheetDocumentId: string, content: string) => {
    sending.value = true
    error.value = null

    try {
      const response = await ChatConversationService.startConversation({
        catSheetDocumentId,
        content,
      })
      currentConversation.value = response.data.data
      replaceConversationInList(response.data.data)
      return currentConversation.value
    } catch (sendError) {
      error.value = getErrorMessage(sendError)
      throw sendError
    } finally {
      sending.value = false
    }
  }

  const sendMessage = async (content: string) => {
    if (!currentConversation.value) {
      throw new Error('No conversation is currently selected')
    }

    sending.value = true
    error.value = null

    try {
      const response = await ChatConversationService.sendMessage(
        currentConversation.value.documentId,
        { content },
      )
      currentConversation.value = response.data.data
      replaceConversationInList(response.data.data)
      return currentConversation.value
    } catch (sendError) {
      error.value = getErrorMessage(sendError)
      throw sendError
    } finally {
      sending.value = false
    }
  }

  const clearCurrentConversation = () => {
    currentConversation.value = null
    error.value = null
  }

  return {
    conversations,
    currentConversation,
    loading,
    sending,
    error,
    fetchConversations,
    fetchConversation,
    fetchConversationForCatSheet,
    startConversation,
    sendMessage,
    clearCurrentConversation,
  }
})
