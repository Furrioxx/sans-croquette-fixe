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
const activeStep = ref('1')
const pendingImages = ref<File[]>([])
const keptExistingImageIds = ref<number[]>(props.cat?.images?.map((i) => i.id) || [])

const existingImages = computed(() =>
  props.cat?.images?.filter((img) => keptExistingImageIds.value.includes(img.id)) || [],
)

const getImageUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

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
  activeStep.value = '1'
  pendingImages.value = []
  keptExistingImageIds.value = props.cat?.images?.map((i) => i.id) || []
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
  errors.value.push(
    StringUtils.checkRequiredValidity('birthDate', form.value.birthDate, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkRequiredValidity('gender', form.value.gender, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkArrayValidity('cat_moods', form.value.cat_moods, t('requiredInputError')),
  )
  errors.value.push(
    StringUtils.checkNumberValidity('age', form.value.age, t('requiredInputError')),
  )

  return errors.value.filter((x) => x.valid == false).length === 0
}

const goToStep2 = () => {
  if (checkValidity()) activeStep.value = '2'
}

const onImagesSelect = (event: any) => {
  pendingImages.value = event.files
}

const onImagesRemove = (event: any) => {
  pendingImages.value = event.files
}

const onImagesClear = () => {
  pendingImages.value = []
}

const removeExistingImage = (imageId: number) => {
  keptExistingImageIds.value = keptExistingImageIds.value.filter((id) => id !== imageId)
}

const save = async () => {
  let uploadedIds: number[] = []

  if (pendingImages.value.length > 0) {
    const formData = new FormData()
    pendingImages.value.forEach((file) => formData.append('files', file))
    uploadedIds = await catStore.uploadImages(formData)
  }

  const payload: CatPostPut = {
    ...form.value,
    images: [...keptExistingImageIds.value, ...uploadedIds],
  }

  if (isEditMode.value) {
    await catStore.updateCat(props.cat!.documentId, payload)
  } else {
    await catStore.addCat(payload)
  }

  emit('update:visible', false)
  emit('update:datas')
}
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    @update:visible="emit('update:visible', false)"
    :style="{ width: '48rem' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <span class="font-bold whitespace-nowrap">{{ header }}</span>
      </div>
    </template>

    <Stepper v-model:value="activeStep" linear class="w-full">
      <StepList>
        <Step value="1">{{ $t('admin.cat.step-info') }}</Step>
        <Step value="2">{{ $t('admin.cat.step-images') }}</Step>
      </StepList>

      <StepPanels>
        <StepPanel value="1">
          <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
            $t('admin.cat.cat-edit-helper')
          }}</span>

          <ToggleSwitchWithLabel
            name="isDuo"
            v-model="form.isDuo"
            :label="$t('admin.cat.isDuo')"
          />
          <InputTextWithLabel
            name="name"
            :label="$t('admin.cat.name')"
            v-model="form.name"
            required
            :valid="StringUtils.getFieldError(errors, 'name')?.valid"
            :errorMessage="StringUtils.getFieldError(errors, 'name')?.message"
          />
          <DatePickerWithLabel
            name="birthDate"
            :label="$t('admin.cat.birthDate')"
            v-model="form.birthDate"
            required
            :valid="StringUtils.getFieldError(errors, 'birthDate')?.valid"
            :errorMessage="StringUtils.getFieldError(errors, 'birthDate')?.message"
          />
          <SelectWithLabel
            name="gender"
            :options="GenderList"
            optionLabel="label"
            optionValue="value"
            v-model="form.gender"
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
            v-model="form.cat_moods"
            :label="$t('admin.cat.mood')"
            :filter="true"
            required
            :valid="StringUtils.getFieldError(errors, 'cat_moods')?.valid"
            :errorMessage="StringUtils.getFieldError(errors, 'cat_moods')?.message"
          />
          <InputNumberWithLabel
            :min="0"
            :max="25"
            :label="$t('admin.cat.age')"
            name="age"
            v-model="form.age"
            required
            :valid="StringUtils.getFieldError(errors, 'age')?.valid"
            :errorMessage="StringUtils.getFieldError(errors, 'age')?.message"
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
        </StepPanel>

        <StepPanel value="2">
          <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
            $t('admin.cat.images-helper')
          }}</span>

          <div v-if="existingImages.length > 0" class="mb-4">
            <p class="font-semibold mb-2">{{ $t('admin.cat.existing-images') }}</p>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="image in existingImages"
                :key="image.id"
                class="relative"
              >
                <img
                  :src="getImageUrl(image.url)"
                  :alt="image.name"
                  class="w-24 h-24 object-cover rounded"
                />
                <Button
                  icon="pi pi-times"
                  rounded
                  text
                  severity="danger"
                  size="small"
                  class="absolute -top-2 -right-2"
                  @click="removeExistingImage(image.id)"
                />
              </div>
            </div>
          </div>

          <FileUpload
            :multiple="true"
            accept="image/*"
            customUpload
            @select="onImagesSelect"
            @remove="onImagesRemove"
            @clear="onImagesClear"
            @uploader="() => {}"
            :showUploadButton="false"
          />
        </StepPanel>
      </StepPanels>
    </Stepper>

    <template #footer>
      <Button
        :label="$t('cancel')"
        text
        severity="secondary"
        @click="emit('update:visible', false)"
      />
      <Button
        v-if="activeStep === '2'"
        :label="$t('back')"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="activeStep = '1'"
      />
      <Button
        v-if="activeStep === '1'"
        :label="$t('next')"
        severity="info"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="goToStep2"
      />
      <Button
        v-if="activeStep === '2'"
        :label="$t('save')"
        variant="outlined"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        @click="save"
      />
    </template>
  </Dialog>
</template>
