<script setup lang="ts">
import type { CatPostPut } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { useCatStore } from '@/stores/cats'
import { useCatSheetStore } from '@/stores/catSheets'
import { useCatMoodStore } from '@/stores/catMoods'
import { useTarificationStore } from '@/stores/tarifications'
import { UserService } from '@/services/userService'
import type { User } from '@/models/User'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CatFormPanel from '../Forms/CatFormPanel.vue'
import CatSheetGeneralPanel from '../Forms/CatSheetGeneralPanel.vue'
import CatSheetImagesPanel from '../Forms/CatSheetImagesPanel.vue'
import CatSheetSuiviPanel from '../Forms/CatSheetSuiviPanel.vue'

const { t } = useI18n()
const catStore = useCatStore()
const catSheetStore = useCatSheetStore()
const catMoodStore = useCatMoodStore()
const tarificationStore = useTarificationStore()
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
const generalPanel = ref<InstanceType<typeof CatSheetGeneralPanel> | null>(null)
const cat1Panel = ref<InstanceType<typeof CatFormPanel> | null>(null)
const cat2Panel = ref<InstanceType<typeof CatFormPanel> | null>(null)
const imagesPanel = ref<InstanceType<typeof CatSheetImagesPanel> | null>(null)

const volunteers = ref<User[]>([])

const generalForm = ref({
  isDuo: props.catSheet?.isDuo || false,
  linkedVolunteer: props.catSheet?.linkedVolunteer?.id || (null as number | null),
  backupVolunteer: props.catSheet?.backupVolunteer?.id || (null as number | null),
  tarification: props.catSheet?.tarification?.id || (null as number | null),
  description: props.catSheet?.description || (null as string | null),
})

const makeCatForm = (index: number): CatPostPut => {
  const cat = props.catSheet?.cats?.[index]
  return {
    name: cat?.name || '',
    birthDate: cat?.birthDate || null,
    gender: cat?.gender || Genders.FEMALE,
    vaccinated: cat?.vaccinated || false,
    identified: cat?.identified || false,
    sterilized: cat?.sterilized || false,
    decontaminate: cat?.decontaminate || false,
    dogFriendly: cat?.dogFriendly || CatFriendly.NO,
    catFriendly: cat?.catFriendly || CatFriendly.NO,
    childFriendly: cat?.childFriendly || CatFriendly.NO,
    cat_moods: cat?.cat_moods?.map((m) => m.documentId) || [],
    catStatus: cat?.catStatus || null,
    trappingDate: cat?.trappingDate || null,
    medicalHistory: cat?.medicalHistory || null,
  }
}

const cat1Form = ref<CatPostPut>(makeCatForm(0))
const cat2Form = ref<CatPostPut>(makeCatForm(1))

const resetForm = () => {
  generalForm.value = {
    isDuo: props.catSheet?.isDuo || false,
    linkedVolunteer: props.catSheet?.linkedVolunteer?.id || null,
    backupVolunteer: props.catSheet?.backupVolunteer?.id || null,
    tarification: props.catSheet?.tarification?.id || null,
    description: props.catSheet?.description || null,
  }
  cat1Form.value = makeCatForm(0)
  cat2Form.value = makeCatForm(1)
  activeStep.value = '1'
  imagesPanel.value?.reset(props.catSheet?.images || [])
}

watch(() => props.catSheet, resetForm)

onMounted(async () => {
  resetForm()
  await Promise.all([
    catMoodStore.fectchCatMoods(),
    loadVolunteers(),
    tarificationStore.fetchTarifications(),
  ])
})

const loadVolunteers = async () => {
  try {
    const response = await UserService.GetVolunteers()
    volunteers.value = response.data.data
  } catch (error) {
    console.error('Error fetching volunteers:', error)
  }
}

const logicalSteps = computed(() => {
  const steps = ['1', '2']
  if (generalForm.value.isDuo) steps.push('3')
  steps.push('4', '5')
  return steps
})

const validateStep = (step: string): boolean => {
  switch (step) {
    case '1':
      return generalPanel.value?.validate() ?? true
    case '2':
      return cat1Panel.value?.validate() ?? true
    case '3':
      return cat2Panel.value?.validate() ?? true
    default:
      return true
  }
}

const onStepChange = (target: string) => {
  const order = logicalSteps.value
  const from = order.indexOf(activeStep.value)
  const to = order.indexOf(target)

  if (to <= from) {
    activeStep.value = target
    return
  }

  for (let i = from; i < to; i++) {
    if (!validateStep(order[i]!)) {
      activeStep.value = order[i]!
      return
    }
  }
  activeStep.value = target
}

const goNext = () => {
  const order = logicalSteps.value
  const idx = order.indexOf(activeStep.value)
  if (idx < order.length - 1) onStepChange(order[idx + 1]!)
}

const goBack = () => {
  const order = logicalSteps.value
  const idx = order.indexOf(activeStep.value)
  if (idx > 0) onStepChange(order[idx - 1]!)
}

const isLastStep = computed(() => activeStep.value === '5')

const saving = ref(false)

const save = async () => {
  saving.value = true

  try {
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
      backupVolunteer: generalForm.value.backupVolunteer,
      tarification: generalForm.value.tarification,
      images: [...keptIds, ...uploadedIds],
      description: generalForm.value.description,
    }

    if (isEditMode.value) {
      await catSheetStore.updateCatSheet(props.catSheet!.documentId, payload)
    } else {
      await catSheetStore.addCatSheet(payload)
    }

    emit('update:visible', false)
    emit('update:datas')
  } finally {
    saving.value = false
  }
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

    <Stepper :value="activeStep" @update:value="onStepChange" class="w-full">
      <StepList>
        <Step value="1">{{ $t('admin.cat.step-general') }}</Step>
        <Step value="2">{{ $t('admin.cat.step-cat1') }}</Step>
        <Step value="3" v-if="generalForm.isDuo">{{ $t('admin.cat.step-cat2') }}</Step>
        <Step value="4">{{ $t('admin.cat.step-suivi') }}</Step>
        <Step value="5">{{ $t('admin.cat.step-images') }}</Step>
      </StepList>

      <StepPanels>
        <StepPanel value="1">
          <CatSheetGeneralPanel
            ref="generalPanel"
            :isDuo="generalForm.isDuo"
            :linkedVolunteer="generalForm.linkedVolunteer"
            :backupVolunteer="generalForm.backupVolunteer"
            :volunteers="volunteers"
            :tarification="generalForm.tarification"
            :tarifications="tarificationStore.tarifications"
            :description="generalForm.description"
            @update:isDuo="generalForm.isDuo = $event"
            @update:linkedVolunteer="generalForm.linkedVolunteer = $event"
            @update:backupVolunteer="generalForm.backupVolunteer = $event"
            @update:tarification="generalForm.tarification = $event"
            @update:description="generalForm.description = $event"
          />
        </StepPanel>

        <StepPanel value="2">
          <CatFormPanel ref="cat1Panel" v-model="cat1Form" />
        </StepPanel>

        <StepPanel value="3">
          <CatFormPanel ref="cat2Panel" v-model="cat2Form" />
        </StepPanel>

        <StepPanel value="4">
          <CatSheetSuiviPanel
            :cat1="{ trappingDate: cat1Form.trappingDate, medicalHistory: cat1Form.medicalHistory }"
            :cat2="{ trappingDate: cat2Form.trappingDate, medicalHistory: cat2Form.medicalHistory }"
            :isDuo="generalForm.isDuo"
            @update:cat1="cat1Form = { ...cat1Form, ...$event }"
            @update:cat2="cat2Form = { ...cat2Form, ...$event }"
          />
        </StepPanel>

        <StepPanel value="5">
          <CatSheetImagesPanel ref="imagesPanel" :initialImages="props.catSheet?.images || []" />
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
        v-if="isLastStep || isEditMode"
        :label="$t('save')"
        variant="outlined"
        severity="success"
        icon="pi pi-check"
        iconPos="right"
        :loading="saving"
        :disabled="saving"
        @click="save"
      />
    </template>
  </Dialog>
</template>
