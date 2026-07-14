<script setup lang="ts">
const model = defineModel<any>()

const props = defineProps<{
  options: Object[]
  optionValue: string
  name: string
  label: string
  optionLabel: string
  filter?: boolean
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
    <MultiSelect
      :inputId="props.name"
      :options="props.options"
      v-model="model"
      :optionValue="props.optionValue"
      :optionLabel="props.optionLabel"
      class="flex-auto"
      :filter="props.filter"
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
