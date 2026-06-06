<script setup lang="ts">
import type { CatPostPut } from '@/models/Cat'
import { CatFriendlyList } from '@/models/Enums/CatFriendlyEnum'
import { CatStatusList } from '@/models/Enums/CatStatusEnum'
import { GenderList } from '@/models/Enums/Genders'
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

const form = defineModel<CatPostPut>({ required: true })
const moods = computed(() => catMoodStore.catMoods)
const errors = ref<FormError[]>([])

const validate = (): boolean => {
  errors.value = []
  errors.value.push(StringUtils.checkInputTextValidity('name', form.value!.name, t('requiredInputError')))
  errors.value.push(StringUtils.checkRequiredValidity('birthDate', form.value!.birthDate, t('requiredInputError')))
  errors.value.push(StringUtils.checkRequiredValidity('gender', form.value!.gender, t('requiredInputError')))
  errors.value.push(StringUtils.checkArrayValidity('cat_moods', form.value!.cat_moods, t('requiredInputError')))
  return errors.value.filter((x) => x.valid === false).length === 0
}

defineExpose({ validate })
</script>

<template>
  <InputTextWithLabel
    name="name"
    :label="$t('admin.cat.name')"
    v-model="form!.name"
    required
    :valid="StringUtils.getFieldError(errors, 'name')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'name')?.message"
  />
  <DatePickerWithLabel
    name="birthDate"
    :label="$t('admin.cat.birthDate')"
    v-model="form!.birthDate"
    required
    :valid="StringUtils.getFieldError(errors, 'birthDate')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'birthDate')?.message"
  />
  <SelectWithLabel
    name="gender"
    :options="GenderList"
    optionLabel="label"
    optionValue="value"
    v-model="form!.gender"
    :label="$t('admin.cat.gender')"
    required
    :valid="StringUtils.getFieldError(errors, 'gender')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'gender')?.message"
  />
  <SelectWithLabel
    name="catStatus"
    :options="CatStatusList"
    optionLabel="label"
    optionValue="value"
    v-model="form!.catStatus"
    :label="$t('admin.cat.status')"
  />
  <MultiSelectWithLabel
    name="cat_moods"
    :options="moods"
    optionLabel="name"
    optionValue="documentId"
    v-model="form!.cat_moods"
    :label="$t('admin.cat.mood')"
    :filter="true"
    required
    :valid="StringUtils.getFieldError(errors, 'cat_moods')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'cat_moods')?.message"
  />
  <div class="flex justify-between">
    <ToggleSwitchWithLabel name="identified" v-model="form!.identified" :label="$t('admin.cat.identified')" />
    <ToggleSwitchWithLabel name="decontaminate" v-model="form!.decontaminate" :label="$t('admin.cat.decontaminate')" />
  </div>
  <div class="flex justify-between">
    <ToggleSwitchWithLabel name="sterilized" v-model="form!.sterilized" :label="$t('admin.cat.sterilized')" />
    <ToggleSwitchWithLabel name="vaccinated" v-model="form!.vaccinated" :label="$t('admin.cat.vaccinated')" />
  </div>
  <div class="flex justify-between gap-3">
    <SelectWithLabel
      name="catFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      v-model="form!.catFriendly"
      :label="$t('admin.cat.catFriendly')"
    />
    <SelectWithLabel
      name="dogFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      v-model="form!.dogFriendly"
      :label="$t('admin.cat.dogFriendly')"
    />
  </div>
  <SelectWithLabel
    name="childFriendly"
    :options="CatFriendlyList"
    optionLabel="label"
    optionValue="value"
    v-model="form!.childFriendly"
    :label="$t('admin.cat.childFriendly')"
  />
</template>
