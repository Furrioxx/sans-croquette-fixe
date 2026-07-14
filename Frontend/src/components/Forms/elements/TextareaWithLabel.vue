<script setup lang="ts">
const model = defineModel<string | null>()

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    tooltip?: string
    disabled?: boolean
    rows?: number
    required?: boolean
    valid?: boolean
    errorMessage?: string
  }>(),
  {
    rows: 4,
  },
)

const handleUpdate = (value: string | undefined) => {
  model.value = value ? value : null
}
</script>

<template>
  <div class="form-field-row">
    <label :for="props.name" class="form-field-label">
      {{ props.label }}<span v-if="props.required" class="form-field-required">*</span>
    </label>
    <Textarea
      :id="props.name"
      class="flex-auto"
      v-tooltip.top="props.tooltip"
      :model-value="model ?? ''"
      @update:model-value="handleUpdate"
      :disabled="props.disabled"
      :rows="props.rows"
      autoResize
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
