<script setup lang="ts">
import type { Cat, CatPostPut } from '@/models/Cat'
import { CatFriendly, CatFriendlyList } from '@/models/Enums/CatFriendlyEnum'
import { GenderList, Genders } from '@/models/Enums/Genders'
import { useCatMoodStore } from '@/stores/catMoods'
import { useCatStore } from '@/stores/cats'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import InputTextWithLabel from '../Forms/elements/InputTextWithLabel.vue'
import DatePickerWithLabel from '../Forms/elements/DatePickerWithLabel.vue'
import InputNumberWithLabel from '../Forms/elements/InputNumberWithLabel.vue'
import SelectWithLabel from '../Forms/elements/SelectWithLabel.vue'
import MultiSelectWithLabel from '../Forms/elements/MultiSelectWithLabel.vue'
import ToggleSwitchWithLabel from '../Forms/elements/ToggleSwitchWithLabel.vue'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'

const { t } = useI18n()
const catMoodStore = useCatMoodStore()
const catStore = useCatStore()
const emit = defineEmits(['update:visible', 'update:datas'])
const props = defineProps<{
  cat: Cat | null
  visible: boolean
}>()

const moods = computed(() => catMoodStore.catMoods)
const header = computed(() => (props.cat ? props.cat.name : t('admin.cat.cat-create')))
const isEditMode = computed<boolean>(() => !!props.cat)
const errors = ref<FormError[]>([])
const form = ref<CatPostPut>({
  name: props.cat?.name || '',
  birthDate: props.cat?.birthDate || null,
  gender: props.cat?.gender || Genders.FEMALE,
  age: props.cat?.age || 0,
  vaccinated: props.cat?.vaccinated || false,
  identified: props.cat?.identified || false,
  sterilized: props.cat?.sterilized || false,
  decontaminate: props.cat?.decontaminate || false,
  dogFriendly: props.cat?.dogFriendly || CatFriendly.NO,
  catFriendly: props.cat?.catFriendly || CatFriendly.NO,
  childFriendly: props.cat?.childFriendly || CatFriendly.NO,
  isDuo: props.cat?.isDuo || false,
  cat_moods: props.cat?.cat_moods?.map((m) => m.documentId) || [],
})

const resetForm = () => {
  form.value = {
    name: props.cat?.name || '',
    birthDate: props.cat?.birthDate || null,
    gender: props.cat?.gender || Genders.FEMALE,
    age: props.cat?.age || 0,
    vaccinated: props.cat?.vaccinated || false,
    identified: props.cat?.identified || false,
    sterilized: props.cat?.sterilized || false,
    decontaminate: props.cat?.decontaminate || false,
    dogFriendly: props.cat?.dogFriendly || CatFriendly.NO,
    catFriendly: props.cat?.catFriendly || CatFriendly.NO,
    childFriendly: props.cat?.childFriendly || CatFriendly.NO,
    isDuo: props.cat?.isDuo || false,
    cat_moods: props.cat?.cat_moods?.map((m) => m.documentId) || [],
  }
  errors.value = []
}

watch(() => props.cat, resetForm)

onMounted(() => {
  resetForm()
  loadData()
})

const loadData = async () => {
  await catMoodStore.fectchCatMoods()
}

const checkValidity = () => {
  errors.value = []
  errors.value.push(
    StringUtils.checkInputTextValidity('name', form.value.name, t('requiredInputError')),
  )

  return errors.value.filter((x) => x.valid == false).length === 0
}

const save = async () => {
  const valid = checkValidity()

  if (valid) {
    if (isEditMode.value) {
      await catStore.updateCat(props.cat!.id, form.value)
    } else {
      await catStore.addCat(form.value)
    }
    emit('update:visible', false)
    emit('update:datas')
  }
}
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    header="Edit Profile"
    @update:visible="emit('update:visible', false)"
    :style="{ width: '40rem' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <span class="font-bold whitespace-nowrap">{{ header }}</span>
      </div>
    </template>
    <span class="text-surface-500 dark =text-surface-400 block mb-4">{{
      $t('admin.cat.cat-edit-helper')
    }}</span>

    <ToggleSwitchWithLabel name="isDuo" v-model="form.isDuo" :label="$t('admin.cat.isDuo')" />
    <InputTextWithLabel
      name="name"
      :label="$t('admin.cat.name')"
      v-model="form.name"
      :valid="StringUtils.getFieldError(errors, 'name')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'name')?.message"
    />
    <DatePickerWithLabel
      name="birthDate"
      :label="$t('admin.cat.birthDate')"
      v-model="form.birthDate"
    />
    <SelectWithLabel
      name="gender"
      :options="GenderList"
      optionLabel="label"
      optionValue="value"
      v-model="form.gender"
      :label="$t('admin.cat.gender')"
    />
    <MultiSelectWithLabel
      name="cat_moods"
      :options="moods"
      optionLabel="name"
      optionValue="documentId"
      v-model="form.cat_moods"
      :label="$t('admin.cat.mood')"
      :filter="true"
    />
    <InputNumberWithLabel
      :min="0"
      :max="25"
      :label="$t('admin.cat.age')"
      name="age"
      :value="form.age"
    />
    <div class="flex justify-between">
      <ToggleSwitchWithLabel
        name="identified"
        v-model="form.identified"
        :label="$t('admin.cat.identified')"
      />
      <ToggleSwitchWithLabel
        name="decontaminate"
        v-model="form.decontaminate"
        :label="$t('admin.cat.decontaminate')"
      />
    </div>
    <div class="flex justify-between">
      <ToggleSwitchWithLabel
        name="sterilized"
        v-model="form.sterilized"
        :label="$t('admin.cat.sterilized')"
      />
      <ToggleSwitchWithLabel
        name="vaccinated"
        v-model="form.vaccinated"
        :label="$t('admin.cat.vaccinated')"
      />
    </div>
    <SelectWithLabel
      name="catFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      v-model="form.catFriendly"
      :label="$t('admin.cat.catFriendly')"
    />
    <SelectWithLabel
      name="dogFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      v-model="form.dogFriendly"
      :label="$t('admin.cat.dogFriendly')"
    />
    <SelectWithLabel
      name="childFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      v-model="form.childFriendly"
      :label="$t('admin.cat.childFriendly')"
    />
    <template #footer>
      <Button
        :label="$t('cancel')"
        text
        severity="secondary"
        @click="emit('update:visible', false)"
        autofocus
      />
      <Button
        :label="$t('save')"
        variant="outlined"
        type="submit"
        severity="success"
        autofocus
        @click="save"
      />
    </template>
  </Dialog>
</template>
