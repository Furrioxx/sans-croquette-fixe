<script setup lang="ts">
import type { Cat, CatPostPut } from '@/models/Cat'
import { CatFriendly, CatFriendlyList } from '@/models/Enums/CatFriendlyEnum'
import { GenderList, Genders } from '@/models/Enums/Genders'
import { useCatMoodStore } from '@/stores/catMoods'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputTextWithLabel from '../Forms/elements/InputTextWithLabel.vue'
import InputNumberWithLabel from '../Forms/elements/InputNumberWithLabel.vue'
import SelectWithLabel from '../Forms/elements/SelectWithLabel.vue'
import MultiSelectWithLabel from '../Forms/elements/MultiSelectWithLabel.vue'
import ToggleSwitchWithLabel from '../Forms/elements/ToggleSwitchWithLabel.vue'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'

const { t } = useI18n()
const catMoodStore = useCatMoodStore()
const emit = defineEmits(['update:visible', 'update:datas'])
const props = defineProps<{
  cat: Cat | null
  visible: boolean
}>()

const moods = computed(() => catMoodStore.catMoods)
const header = computed(() => (props.cat ? props.cat.moods : t('admin.cat.cat-create')))
const errors = ref<FormError[]>([])
const form = ref<CatPostPut>({
  name: props.cat?.name || '',
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
  moods: props.cat?.moods || null,
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  await catMoodStore.fectchCatMoods()
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

    <ToggleSwitchWithLabel name="isDuo" :value="form.isDuo" :label="$t('admin.cat.isDuo')" />
    <InputTextWithLabel
      name="name"
      :label="$t('admin.cat.name')"
      v-model="form.name"
      :valid="StringUtils.getFieldError(errors, 'username')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'username')?.message"
    />
    <SelectWithLabel
      name="gender"
      :options="GenderList"
      optionLabel="label"
      optionValue="value"
      :value="form.gender"
      :label="$t('admin.cat.gender')"
    />
    <MultiSelectWithLabel
      name="moods"
      :options="moods"
      optionLabel="name"
      optionValue="id"
      :value="form.moods"
      :label="$t('admin.cat.gender')"
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
        :value="form.identified"
        :label="$t('admin.cat.identified')"
      />
      <ToggleSwitchWithLabel
        name="decontaminate"
        :value="form.decontaminate"
        :label="$t('admin.cat.decontaminate')"
      />
    </div>
    <div class="flex justify-between">
      <ToggleSwitchWithLabel
        name="sterilized"
        :value="form.sterilized"
        :label="$t('admin.cat.sterilized')"
      />
      <ToggleSwitchWithLabel
        name="vaccinated"
        :value="form.vaccinated"
        :label="$t('admin.cat.vaccinated')"
      />
    </div>
    <SelectWithLabel
      name="catFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      :value="form.catFriendly"
      :label="$t('admin.cat.catFriendly')"
    />
    <SelectWithLabel
      name="dogFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      :value="form.dogFriendly"
      :label="$t('admin.cat.dogFriendly')"
    />
    <SelectWithLabel
      name="childFriendly"
      :options="CatFriendlyList"
      optionLabel="label"
      optionValue="value"
      :value="form.childFriendly"
      :label="$t('admin.cat.childFriendly')"
    />
  </Dialog>
</template>
