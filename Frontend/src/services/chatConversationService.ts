import type {
  ChatConversation,
  SendChatMessagePayload,
  StartChatPayload,
} from '@/models/Chat'
import { axiosInstance } from './axiosInsance'

const API_URL = '/chat-conversations'

export const ChatConversationService = {
  getConversations() {
    return axiosInstance.get<{ data: ChatConversation[] }>(API_URL)
  },

  getConversationForCatSheet(catSheetDocumentId: string) {
    const params = new URLSearchParams({ catSheetDocumentId })
    return axiosInstance.get<{ data: ChatConversation[] }>(`${API_URL}?${params.toString()}`)
  },

  getConversation(documentId: string) {
    return axiosInstance.get<{ data: ChatConversation }>(`${API_URL}/${documentId}`)
  },

  startConversation(payload: StartChatPayload) {
    return axiosInstance.post<{ data: ChatConversation }>(API_URL, {
      data: payload,
    })
  },

  sendMessage(documentId: string, payload: SendChatMessagePayload) {
    return axiosInstance.post<{ data: ChatConversation }>(
      `${API_URL}/${documentId}/messages`,
      { data: payload },
    )
  },
}
