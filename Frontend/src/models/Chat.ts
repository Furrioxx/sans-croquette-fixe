import type { Role } from './User'

export interface ChatParticipant {
  id: number
  username: string
  role?: Pick<Role, 'name'> | null
}

export interface ChatMessage {
  id: number
  documentId: string
  content: string
  createdAt: string
  author: ChatParticipant
}

export interface ChatCat {
  id: number
  documentId: string
  name: string
}

export interface ChatCatSheet {
  id: number
  documentId: string
  cats: ChatCat[]
  linkedVolunteer: ChatParticipant | null
  backupVolunteer: ChatParticipant | null
}

export interface ChatConversation {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  requester: ChatParticipant
  catSheet: ChatCatSheet
  messages: ChatMessage[]
}

export interface StartChatPayload {
  catSheetDocumentId: string
  content: string
}

export interface SendChatMessagePayload {
  content: string
}
