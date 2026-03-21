<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  name: string
  label: string
  min?: number | null
  max?: number | null
  valid?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}</label>
    <InputNumber
      :id="props.name"
      class="flex-auto"
      :model-value="props.modelValue"
      @update:model-value="emit('update:modelValue', $event ?? 0)"
      autocomplete="off"
      :min="props.min ?? undefined"
      :max="props.max ?? undefined"
    />
  </div>
  <Message
    v-if="props.valid === false && props.errorMessage"
    class="mb-2"
    severity="error"
    size="small"
    variant="simple"
    >{{ errorMessage }}</Message
  >
</template>
