<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string | null
  name: string
  label: string
  required?: boolean
  valid?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null | undefined]
}>()

const dateValue = computed({
  get: () => (props.modelValue ? new Date(props.modelValue) : null),
  set: (date: Date | null | undefined) => {
    emit('update:modelValue', date ? date.toISOString().split('T')[0] : null)
  },
})
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}<span v-if="props.required" class="text-red-500 ml-1">*</span></label>
    <DatePicker
      :inputId="props.name"
      v-model="dateValue"
      class="flex-auto"
      dateFormat="dd/mm/yy"
      :showIcon="true"
      showButtonBar
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
