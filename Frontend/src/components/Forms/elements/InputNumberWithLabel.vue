<script setup lang="ts">
const model = defineModel<number | null>({ default: null })

const props = defineProps<{
  name: string
  label: string
  min?: number | null
  max?: number | null
  disabled?: boolean
  required?: boolean
  valid?: boolean
  errorMessage?: string
}>()
</script>

<template>
  <div class="form-field-row">
    <label :for="props.name" class="form-field-label"
      >{{ props.label }}<span v-if="props.required" class="form-field-required">*</span></label
    >
    <InputNumber
      :id="props.name"
      class="flex-auto"
      v-model="model"
      autocomplete="off"
      :min="props.min ?? undefined"
      :max="props.max ?? undefined"
      :disabled="props.disabled"
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
