<script setup lang="ts">
const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    tooltip?: string
    disabled?: boolean
    type?: string
    required?: boolean
    valid?: boolean
    errorMessage?: string
  }>(),
  {
    type: 'text',
  },
)
</script>

<template>
  <div class="flex items-center gap-4 mb-2">
    <label :for="props.name" class="font-semibold w-32">{{ props.label }}<span v-if="props.required" class="text-red-500 ml-1">*</span></label>
    <InputText
      :id="props.name"
      class="flex-auto"
      v-tooltip.top="props.tooltip"
      v-model="model"
      :disabled="props.disabled"
      autocomplete="off"
      :type="props.type"
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
