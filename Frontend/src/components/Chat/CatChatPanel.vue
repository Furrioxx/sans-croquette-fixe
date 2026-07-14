<script setup lang="ts">
import ChatComposer from '@/components/Chat/ChatComposer.vue'
import ChatMessageList from '@/components/Chat/ChatMessageList.vue'
import { Roles } from '@/router/Roles'
import { RouteNames } from '@/router/routeNames'
import { useAuthStore } from '@/stores/authentication'
import { useChatConversationsStore } from '@/stores/chatConversations'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps<{
  catSheetDocumentId: string
  catNames: string
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatConversationsStore()
const panelElement = ref<HTMLElement | null>(null)
const composer = ref<{ clear: () => void } | null>(null)
const isComposerOpen = ref(false)

const hasMessages = computed(() => (chatStore.currentConversation?.messages.length ?? 0) > 0)
const isVisible = computed(() => isComposerOpen.value || hasMessages.value)
const currentUserId = computed(() => authStore.user?.id ?? null)

const scrollToPanel = async () => {
  await nextTick()
  panelElement.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const loadConversation = async () => {
  chatStore.clearCurrentConversation()

  if (authStore.getUserRole !== Roles.USER) return

  try {
    await chatStore.fetchConversationForCatSheet(props.catSheetDocumentId)
  } catch {
    // The store exposes the load error if the panel is open.
  }
}

const openChat = async () => {
  if (!authStore.isConnected) {
    const redirect = router.resolve({
      name: RouteNames.ADOPT_DETAIL,
      params: { documentId: props.catSheetDocumentId },
      query: { question: '1' },
    }).fullPath

    await router.push({ name: RouteNames.LOGIN, query: { redirect } })
    return
  }

  if (authStore.getUserRole !== Roles.USER) return

  isComposerOpen.value = true

  if (!chatStore.currentConversation) {
    await loadConversation()
  }

  await scrollToPanel()
}

const send = async (content: string) => {
  try {
    if (chatStore.currentConversation) {
      await chatStore.sendMessage(content)
    } else {
      await chatStore.startConversation(props.catSheetDocumentId, content)
    }

    composer.value?.clear()
  } catch {
    // The store exposes a generic send error below the composer.
  }
}

watch(
  () => [props.catSheetDocumentId, authStore.isConnected, authStore.getUserRole] as const,
  async ([, isConnected, role]) => {
    if (!isConnected || role !== Roles.USER) {
      chatStore.clearCurrentConversation()
      return
    }

    if (route.query.question === '1') {
      isComposerOpen.value = true
    }

    await loadConversation()

    if (isVisible.value) {
      await scrollToPanel()
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  chatStore.clearCurrentConversation()
})

defineExpose({ openChat })
</script>

<template>
  <Transition name="chat-panel">
    <section
      v-if="isVisible"
      id="cat-chat"
      ref="panelElement"
      class="w-full bg-[var(--scf-bg)] px-6 py-12 md:px-[60px]"
    >
      <div class="page-shell mx-auto max-w-3xl">
        <div class="overflow-hidden rounded-[26px] border border-[var(--scf-line)] bg-white shadow-[var(--scf-shadow)]">
          <header class="flex items-start gap-4 border-b border-[var(--scf-line)] px-5 py-5 sm:px-7">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--scf-accent-soft)] text-[var(--scf-accent-dark)]">
              <i class="pi pi-comments text-lg"></i>
            </div>
            <div>
              <p class="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--scf-accent-dark)]">
                {{ $t('chat.eyebrow') }}
              </p>
              <h2 class="display-font text-xl font-bold text-[var(--scf-ink)] sm:text-2xl">
                {{ $t('chat.title', { names: catNames }) }}
              </h2>
              <p class="mt-1 text-sm text-[var(--scf-muted)]">{{ $t('chat.helper') }}</p>
            </div>
          </header>

          <div class="px-5 py-3 sm:px-7">
            <ChatMessageList
              v-if="chatStore.currentConversation"
              :messages="chatStore.currentConversation.messages"
              :current-user-id="currentUserId"
            />
            <div v-else class="flex min-h-40 items-center justify-center px-4 text-center">
              <p class="max-w-md text-sm leading-relaxed text-[var(--scf-muted)]">
                {{ $t('chat.firstMessage') }}
              </p>
            </div>

            <ChatComposer
              ref="composer"
              :sending="chatStore.sending"
              :autofocus="!hasMessages"
              @send="send"
            />

            <p v-if="chatStore.error" class="mt-3 text-sm font-medium text-[var(--scf-danger)]" role="alert">
              {{ $t('chat.error') }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
