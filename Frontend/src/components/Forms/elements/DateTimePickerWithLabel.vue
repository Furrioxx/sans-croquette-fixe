<script setup lang="ts">
const model = defineModel<Date | null>()

const props = defineProps<{
  name: string
  label: string
  required?: boolean
  valid?: boolean
  errorMessage?: string
  minDate?: Date
  maxDate?: Date
}>()
</script>

<template>
  <div class="form-field-row">
    <label :for="props.name" class="form-field-label">
      {{ props.label }}<span v-if="props.required" class="form-field-required">*</span>
    </label>
    <DatePicker
      :inputId="props.name"
      v-model="model"
      class="flex-auto"
      :showIcon="true"
      showTime
      hourFormat="24"
      :minDate="props.minDate"
      :maxDate="props.maxDate"
      inputClass="w-full"
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
