<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<string | null>()

const props = defineProps<{
  name: string
  label: string
  disabled?: boolean
  required?: boolean
  valid?: boolean
  errorMessage?: string
}>()

const dateValue = computed({
  get: () => (model.value ? new Date(model.value) : null),
  set: (date: Date | null | undefined) => {
    model.value = date ? date.toISOString().split('T')[0] : null
  },
})
</script>

<template>
  <div class="form-field-row">
    <label :for="props.name" class="form-field-label"
      >{{ props.label }}<span v-if="props.required" class="form-field-required">*</span></label
    >
    <DatePicker
      :inputId="props.name"
      v-model="dateValue"
      class="flex-auto"
      dateFormat="dd/mm/yy"
      :showIcon="true"
      :disabled="props.disabled"
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
