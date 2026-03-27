<script setup lang="ts">
import type { CatPostPut } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { useCatStore } from '@/stores/cats'
import { useCatSheetStore } from '@/stores/catSheets'
import { useCatMoodStore } from '@/stores/catMoods'
import { UserService } from '@/services/userService'
import type { User } from '@/models/User'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CatFormPanel from '../Forms/CatFormPanel.vue'
import CatSheetGeneralPanel from '../Forms/CatSheetGeneralPanel.vue'
import CatSheetImagesPanel from '../Forms/CatSheetImagesPanel.vue'

const { t } = useI18n()
const catStore = useCatStore()
const catSheetStore = useCatSheetStore()
const catMoodStore = useCatMoodStore()
const emit = defineEmits(['update:visible', 'update:datas'])
const props = defineProps<{
  catSheet: CatSheet | null
  visible: boolean
}>()

const header = computed(() =>
  props.catSheet ? t('admin.cat.cat-edit-helper') : t('admin.cat.cat-create'),
)
const isEditMode = computed<boolean>(() => !!props.catSheet)
const activeStep = ref('1')
const cat1Panel = ref<InstanceType<typeof CatFormPanel> | null>(null)
const cat2Panel = ref<InstanceType<typeof CatFormPanel> | null>(null)
const imagesPanel = ref<InstanceType<typeof CatSheetImagesPanel> | null>(null)

const volunteers = ref<User[]>([])

const generalForm = ref({
  isDuo: props.catSheet?.isDuo || false,
  linkedVolunteer: props.catSheet?.linkedVolunteer?.id || null as number | null,
})

const makeCatForm = (index: number): CatPostPut => {
  const cat = props.catSheet?.cats?.[index]
  return {
    name: cat?.name || '',
    birthDate: cat?.birthDate || null,
    gender: cat?.gender || Genders.FEMALE,
    age: cat?.age || 0,
    vaccinated: cat?.vaccinated || false,
    identified: cat?.identified || false,
    sterilized: cat?.sterilized || false,
    decontaminate: cat?.decontaminate || false,
    dogFriendly: cat?.dogFriendly || CatFriendly.NO,
    catFriendly: cat?.catFriendly || CatFriendly.NO,
    childFriendly: cat?.childFriendly || CatFriendly.NO,
    cat_moods: cat?.cat_moods?.map((m) => m.documentId) || [],
  }
}

const cat1Form = ref<CatPostPut>(makeCatForm(0))
const cat2Form = ref<CatPostPut>(makeCatForm(1))

const resetForm = () => {
  generalForm.value = {
    isDuo: props.catSheet?.isDuo || false,
    linkedVolunteer: props.catSheet?.linkedVolunteer?.id || null,
  }
  cat1Form.value = makeCatForm(0)
  cat2Form.value = makeCatForm(1)
  activeStep.value = '1'
  imagesPanel.value?.reset(props.catSheet?.images || [])
}

watch(() => props.catSheet, resetForm)

onMounted(async () => {
  resetForm()
  await Promise.all([catMoodStore.fectchCatMoods(), loadVolunteers()])
})

const loadVolunteers = async () => {
  try {
    const response = await UserService.GetVolunteers()
    volunteers.value = response.data.data
  } catch (error) {
    console.error('Error fetching volunteers:', error)
  }
}

const goNext = () => {
  if (activeStep.value === '1') {
    activeStep.value = '2'
  } else if (activeStep.value === '2') {
    if (!cat1Panel.value?.validate()) return
    activeStep.value = generalForm.value.isDuo ? '3' : '4'
  } else if (activeStep.value === '3') {
    if (!cat2Panel.value?.validate()) return
    activeStep.value = '4'
  }
}

const goBack = () => {
  if (activeStep.value === '4') {
    activeStep.value = generalForm.value.isDuo ? '3' : '2'
  } else if (activeStep.value === '3') {
    activeStep.value = '2'
  } else if (activeStep.value === '2') {
    activeStep.value = '1'
  }
}

const isLastStep = computed(
  () => activeStep.value === '4' || (activeStep.value === '3' && !generalForm.value.isDuo),
)

const save = async () => {
  const { keptIds, pendingFiles } = imagesPanel.value!.getState()

  let uploadedIds: number[] = []
  if (pendingFiles.length > 0) {
    const formData = new FormData()
    pendingFiles.forEach((file) => formData.append('files', file))
    uploadedIds = await catSheetStore.uploadImages(formData)
  }

  let cat1DocumentId: string
  let cat2DocumentId: string | undefined

  if (isEditMode.value && props.catSheet!.cats?.[0]) {
    await catStore.updateCat(props.catSheet!.cats[0].documentId, cat1Form.value)
    cat1DocumentId = props.catSheet!.cats[0].documentId
  } else {
    const response = await catStore.addCatAndReturn(cat1Form.value)
    cat1DocumentId = response.documentId
  }

  if (generalForm.value.isDuo) {
    if (isEditMode.value && props.catSheet!.cats?.[1]) {
      await catStore.updateCat(props.catSheet!.cats[1].documentId, cat2Form.value)
      cat2DocumentId = props.catSheet!.cats[1].documentId
    } else {
      const response = await catStore.addCatAndReturn(cat2Form.value)
      cat2DocumentId = response.documentId
    }
  }

  const payload = {
    isDuo: generalForm.value.isDuo,
    cats: cat2DocumentId ? [cat1DocumentId, cat2DocumentId] : [cat1DocumentId],
    linkedVolunteer: generalForm.value.linkedVolunteer,
    images: [...keptIds, ...uploadedIds],
  }

  if (isEditMode.value) {
    await catSheetStore.updateCatSheet(props.catSheet!.documentId, payload)
  } else {
    await catSheetStore.addCatSheet(payload)
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

    <Stepper v-model:value="activeStep" :linear="!isEditMode" class="w-full">
      <StepList>
        <Step value="1">{{ $t('admin.cat.step-general') }}</Step>
        <Step value="2">{{ $t('admin.cat.step-cat1') }}</Step>
        <Step value="3" v-if="generalForm.isDuo">{{ $t('admin.cat.step-cat2') }}</Step>
        <Step value="4">{{ $t('admin.cat.step-images') }}</Step>
      </StepList>

      <StepPanels>
        <StepPanel value="1">
          <CatSheetGeneralPanel
            :isDuo="generalForm.isDuo"
            :linkedVolunteer="generalForm.linkedVolunteer"
            :volunteers="volunteers"
            @update:isDuo="generalForm.isDuo = $event"
            @update:linkedVolunteer="generalForm.linkedVolunteer = $event"
          />
        </StepPanel>

        <StepPanel value="2">
          <CatFormPanel ref="cat1Panel" v-model="cat1Form" />
        </StepPanel>

        <StepPanel value="3">
          <CatFormPanel ref="cat2Panel" v-model="cat2Form" />
        </StepPanel>

        <StepPanel value="4">
          <CatSheetImagesPanel
            ref="imagesPanel"
            :initialImages="props.catSheet?.images || []"
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
        v-if="activeStep !== '1'"
        :label="$t('back')"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="goBack"
      />
      <Button
        v-if="!isLastStep"
        :label="$t('next')"
        severity="info"
        icon="pi pi-arrow-right"
        iconPos="right"
        @click="goNext"
      />
      <Button
        v-if="isLastStep"
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
