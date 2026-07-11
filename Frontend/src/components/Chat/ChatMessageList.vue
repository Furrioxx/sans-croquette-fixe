<script setup lang="ts">
import type { ChatMessage } from '@/models/Chat'
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  messages: ChatMessage[]
  currentUserId: number | null
}>()

const listElement = ref<HTMLElement | null>(null)

const formatMessageDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

const scrollToLatestMessage = async () => {
  await nextTick()
  listElement.value?.scrollTo({
    top: listElement.value.scrollHeight,
    behavior: 'smooth',
  })
}

watch(
  () => props.messages[props.messages.length - 1]?.documentId,
  scrollToLatestMessage,
  { immediate: true },
)
</script>

<template>
  <div
    ref="listElement"
    class="flex max-h-[28rem] min-h-56 flex-col gap-4 overflow-y-auto px-1 py-3"
    role="log"
    aria-live="polite"
  >
    <article
      v-for="message in messages"
      :key="message.documentId"
      class="flex max-w-[88%] flex-col gap-1 sm:max-w-[72%]"
      :class="message.author?.id === currentUserId ? 'self-end items-end' : 'self-start items-start'"
    >
      <div
        class="rounded-2xl px-4 py-3 text-sm leading-relaxed"
        :class="
          message.author?.id === currentUserId
            ? 'rounded-br-md bg-[var(--scf-accent)] text-white'
            : 'rounded-bl-md bg-[var(--scf-bg)] text-[var(--scf-ink)]'
        "
      >
        <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
      </div>
      <span class="px-1 text-[0.7rem] font-medium text-[var(--scf-muted)]">
        {{ message.author?.username ?? $t('chat.unknownUser') }} · {{ formatMessageDate(message.createdAt) }}
      </span>
    </article>
  </div>
</template>
