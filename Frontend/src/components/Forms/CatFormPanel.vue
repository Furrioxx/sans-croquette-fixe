<script setup lang="ts">
import type { CatPostPut } from '@/models/Cat'
import { CatFriendly, CatFriendlyList } from '@/models/Enums/CatFriendlyEnum'
import { GenderList, Genders } from '@/models/Enums/Genders'
import { useCatMoodStore } from '@/stores/catMoods'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputTextWithLabel from './elements/InputTextWithLabel.vue'
import DatePickerWithLabel from './elements/DatePickerWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'
import MultiSelectWithLabel from './elements/MultiSelectWithLabel.vue'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'

const { t } = useI18n()
const catMoodStore = useCatMoodStore()

const props = defineProps<{
  modelValue: CatPostPut
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CatPostPut]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const updateField = <K extends keyof CatPostPut>(key: K, value: CatPostPut[K]) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const moods = computed(() => catMoodStore.catMoods)
const errors = ref<FormError[]>([])

const validate = (): boolean => {
  errors.value = []
  errors.value.push(
    StringUtils.checkInputTextValidity('name', form.value.name, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkRequiredValidity('birthDate', form.value.birthDate, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkRequiredValidity('gender', form.value.gender, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkArrayValidity('cat_moods', form.value.cat_moods, t('requiredInputError')),
  )
  return errors.value.filter((x) => x.valid === false).length === 0
}

defineExpose({ validate })
</script>

<template>
  <InputTextWithLabel
    name="name"
    :label="$t('admin.cat.name')"
    :modelValue="form.name"
    @update:modelValue="updateField('name', $event)"
    required
    :valid="StringUtils.getFieldError(errors, 'name')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'name')?.message"
  />
  <DatePickerWithLabel
    name="birthDate"
    :label="$t('admin.cat.birthDate')"
    :modelValue="form.birthDate"
    @update:modelValue="updateField('birthDate', $event ?? null)"
    required
    :valid="StringUtils.getFieldError(errors, 'birthDate')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'birthDate')?.message"
  />
  <SelectWithLabel
    name="gender"
    :options="GenderList"
    optionLabel="label"
    optionValue="value"
    :modelValue="form.gender"
    @update:modelValue="updateField('gender', $event as Genders)"
    :label="$t('admin.cat.gender')"
    required
    :valid="StringUtils.getFieldError(errors, 'gender')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'gender')?.message"
  />
  <MultiSelectWithLabel
    name="cat_moods"
    :options="moods"
    optionLabel="name"
    optionValue="documentId"
    :modelValue="form.cat_moods"
    @update:modelValue="updateField('cat_moods', $event)"
    :label="$t('admin.cat.mood')"
    :filter="true"
    required
    :valid="StringUtils.getFieldError(errors, 'cat_moods')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'cat_moods')?.message"
  />
  <div class="flex justify-between">
    <ToggleSwitchWithLabel
      name="identified"
      :modelValue="form.identified"
      @update:modelValue="updateField('identified', $event)"
      :label="$t('admin.cat.identified')"
    />
    <ToggleSwitchWithLabel
      name="decontaminate"
      :modelValue="form.decontaminate"
      @update:modelValue="updateField('decontaminate', $event)"
      :label="$t('admin.cat.decontaminate')"
    />
  </div>
  <div class="flex justify-between">
    <ToggleSwitchWithLabel
      name="sterilized"
      :modelValue="form.sterilized"
      @update:modelValue="updateField('sterilized', $event)"
      :label="$t('admin.cat.sterilized')"
    />
    <ToggleSwitchWithLabel
      name="vaccinated"
      :modelValue="form.vaccinated"
      @update:modelValue="updateField('vaccinated', $event)"
      :label="$t('admin.cat.vaccinated')"
    />
  </div>
  <div class="flex justify-between gap-3">
    <SelectWithLabel
      name="catFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      :modelValue="form.catFriendly"
      @update:modelValue="updateField('catFriendly', $event as CatFriendly)"
      :label="$t('admin.cat.catFriendly')"
    />
    <SelectWithLabel
      name="dogFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      :modelValue="form.dogFriendly"
      @update:modelValue="updateField('dogFriendly', $event as CatFriendly)"
      :label="$t('admin.cat.dogFriendly')"
    />
  </div>
  <SelectWithLabel
    name="childFriendly"
    :options="CatFriendlyList"
    optionLabel="label"
    optionValue="value"
    :modelValue="form.childFriendly"
    @update:modelValue="updateField('childFriendly', $event as CatFriendly)"
    :label="$t('admin.cat.childFriendly')"
  />
</template>
