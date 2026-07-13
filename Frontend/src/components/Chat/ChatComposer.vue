<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    sending?: boolean
    autofocus?: boolean
  }>(),
  {
    sending: false,
    autofocus: false,
  },
)

const emit = defineEmits<{
  send: [content: string]
}>()

const content = ref('')
const trimmedContent = computed(() => content.value.trim())
const canSend = computed(
  () => trimmedContent.value.length > 0 && trimmedContent.value.length <= 2000 && !props.sending,
)

const submit = () => {
  if (!canSend.value) return
  emit('send', trimmedContent.value)
}

const clear = () => {
  content.value = ''
}

defineExpose({ clear })
</script>

<template>
  <form class="border-t border-[var(--scf-line)] pt-4" @submit.prevent="submit">
    <label class="sr-only" for="chat-message">{{ $t('chat.messageLabel') }}</label>
    <textarea
      id="chat-message"
      v-model="content"
      :autofocus="autofocus"
      :placeholder="$t('chat.placeholder')"
      maxlength="2000"
      rows="3"
      class="w-full resize-none rounded-2xl border border-[var(--scf-line)] bg-[var(--scf-surface-strong)] px-4 py-3 text-sm text-[var(--scf-ink)] outline-none transition focus:border-[var(--scf-accent)] focus:ring-2 focus:ring-[var(--scf-accent-soft)]"
      @keydown.enter.exact.prevent="submit"
    ></textarea>
    <div class="mt-2 flex items-center justify-between gap-4">
      <span class="text-xs text-[var(--scf-muted)]">{{ content.length }} / 2000</span>
      <Button
        type="submit"
        :label="$t('chat.send')"
        icon="pi pi-send"
        icon-pos="right"
        rounded
        :loading="sending"
        :disabled="!canSend"
        class="!border-[var(--scf-accent)] !bg-[var(--scf-accent)] hover:!border-[var(--scf-accent-dark)] hover:!bg-[var(--scf-accent-dark)]"
      />
    </div>
  </form>
</template>
