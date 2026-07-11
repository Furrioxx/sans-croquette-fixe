<script setup lang="ts">
import ChatComposer from '@/components/Chat/ChatComposer.vue'
import ChatMessageList from '@/components/Chat/ChatMessageList.vue'
import type { ChatConversation } from '@/models/Chat'
import notificationService from '@/services/notificationService'
import { useAuthStore } from '@/stores/authentication'
import { useChatConversationsStore } from '@/stores/chatConversations'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const authStore = useAuthStore()
const chatStore = useChatConversationsStore()
const selectedDocumentId = ref<string | null>(null)
const composer = ref<{ clear: () => void } | null>(null)

const currentUserId = computed(() => authStore.user?.id ?? null)
const activeConversation = computed(() => {
  if (chatStore.currentConversation?.documentId !== selectedDocumentId.value) return null
  return chatStore.currentConversation
})

const getCatNames = (conversation: ChatConversation) => {
  const names = conversation.catSheet?.cats?.map((cat) => cat.name).filter(Boolean) ?? []
  return names.length ? names.join(' & ') : t('admin.chatDashboard.unavailableCatSheet')
}

const getLastMessage = (conversation: ChatConversation) =>
  conversation.messages[conversation.messages.length - 1] ?? null

const getRequesterName = (conversation: ChatConversation) =>
  conversation.requester?.username ?? t('chat.unknownUser')

const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date))
    : '-'

const startWorkspacePolling = () => {
  chatStore.startPolling({
    type: 'workspace',
    conversationDocumentId: selectedDocumentId.value,
  })
}

const selectConversation = async (documentId: string) => {
  selectedDocumentId.value = documentId

  try {
    await chatStore.fetchConversation(documentId)
    startWorkspacePolling()
  } catch {
    notificationService.showError(t('error'), t('admin.chatDashboard.loadError'))
  }
}

const loadConversations = async () => {
  try {
    await chatStore.fetchConversations()

    const selectedStillExists = chatStore.conversations.some(
      (conversation) => conversation.documentId === selectedDocumentId.value,
    )

    if (!selectedStillExists) {
      selectedDocumentId.value = null
      chatStore.clearCurrentConversation()
    }

    const firstConversation = chatStore.conversations[0]
    if (!selectedDocumentId.value && firstConversation) {
      await selectConversation(firstConversation.documentId)
      return
    }

    if (selectedDocumentId.value) {
      await chatStore.fetchConversation(selectedDocumentId.value)
    }

    startWorkspacePolling()
  } catch {
    notificationService.showError(t('error'), t('admin.chatDashboard.loadError'))
  }
}

const send = async (content: string) => {
  try {
    await chatStore.sendMessage(content)
    composer.value?.clear()
    startWorkspacePolling()
  } catch {
    notificationService.showError(t('error'), t('admin.chatDashboard.sendError'))
  }
}

onMounted(loadConversations)

onBeforeUnmount(() => {
  chatStore.stopPolling()
  chatStore.clearCurrentConversation()
})
</script>

<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col gap-6">
    <header class="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary-600">
          {{ $t('admin.nav.conversations') }}
        </p>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('admin.chatDashboard.title') }}</h1>
        <p class="mt-2 max-w-2xl text-sm text-gray-500">
          {{ $t('admin.chatDashboard.subtitle') }}
        </p>
      </div>
      <Button
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        :aria-label="$t('admin.chatDashboard.refresh')"
        :loading="chatStore.loading"
        @click="loadConversations"
      />
    </header>

    <div
      v-if="chatStore.conversations.length"
      class="grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white lg:grid-cols-[21rem_minmax(0,1fr)]"
    >
      <aside class="border-b border-gray-200 lg:border-b-0 lg:border-r">
        <div class="border-b border-gray-200 px-5 py-4">
          <h2 class="font-semibold text-gray-900">{{ $t('admin.chatDashboard.listTitle') }}</h2>
          <p class="mt-1 text-xs text-gray-500">{{ chatStore.conversations.length }} conversation(s)</p>
        </div>

        <div class="max-h-[24rem] overflow-y-auto lg:max-h-[calc(100vh-15rem)]">
          <button
            v-for="conversation in chatStore.conversations"
            :key="conversation.documentId"
            type="button"
            class="w-full border-b border-gray-100 px-5 py-4 text-left transition hover:bg-gray-50"
            :class="
              selectedDocumentId === conversation.documentId
                ? 'bg-primary-50 shadow-[inset_3px_0_0_var(--p-primary-500)]'
                : 'bg-white'
            "
            @click="selectConversation(conversation.documentId)"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="font-semibold text-gray-900">{{ getCatNames(conversation) }}</span>
              <span class="shrink-0 text-[0.68rem] text-gray-400">
                {{ formatDate(conversation.lastMessageAt) }}
              </span>
            </div>
            <p class="mt-1 text-xs font-medium text-primary-700">
              {{ getRequesterName(conversation) }}
            </p>
            <p class="mt-2 truncate text-sm text-gray-500">
              {{ getLastMessage(conversation)?.content ?? $t('admin.chatDashboard.noMessage') }}
            </p>
          </button>
        </div>
      </aside>

      <section v-if="activeConversation" class="flex min-h-[32rem] flex-col">
        <header class="border-b border-gray-200 px-5 py-4 sm:px-7">
          <h2 class="text-lg font-bold text-gray-900">
            {{ $t('admin.chatDashboard.with', { username: getRequesterName(activeConversation) }) }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            {{ $t('admin.chatDashboard.about', { names: getCatNames(activeConversation) }) }}
          </p>
        </header>

        <div class="flex flex-1 flex-col px-5 py-3 sm:px-7">
          <ChatMessageList
            class="flex-1"
            :messages="activeConversation.messages"
            :current-user-id="currentUserId"
          />
          <ChatComposer ref="composer" :sending="chatStore.sending" @send="send" />
        </div>
      </section>

      <div v-else class="flex min-h-80 items-center justify-center px-6 text-center text-gray-500">
        <div>
          <i class="pi pi-comments mb-4 text-3xl text-gray-300"></i>
          <p>{{ $t('admin.chatDashboard.select') }}</p>
        </div>
      </div>
    </div>

    <div
      v-else-if="!chatStore.loading"
      class="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center"
    >
      <div>
        <i class="pi pi-inbox mb-4 text-4xl text-gray-300"></i>
        <p class="font-medium text-gray-600">{{ $t('admin.chatDashboard.empty') }}</p>
      </div>
    </div>
  </div>
</template>
