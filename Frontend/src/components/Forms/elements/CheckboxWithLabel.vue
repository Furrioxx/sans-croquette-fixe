<script setup lang="ts">
const model = defineModel<any>()

const props = defineProps<{
  name: string
  label: string
  value?: unknown
  binary?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <label
    :for="props.name"
    class="flex items-center gap-2 group/cb"
    :class="props.disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'"
  >
    <Checkbox
      :inputId="props.name"
      v-model="model"
      :binary="props.binary"
      :value="props.value"
      :disabled="props.disabled"
    />
    <span
      class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors"
      >{{ props.label }}</span
    >
  </label>
</template>
