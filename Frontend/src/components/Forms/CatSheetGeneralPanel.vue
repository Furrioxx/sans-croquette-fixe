<script setup lang="ts">
import type { User } from '@/models/User'
import type { Tarification } from '@/models/Tarification'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ToggleSwitchWithLabel from './elements/ToggleSwitchWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'

const { t } = useI18n()

const props = defineProps<{
  isDuo: boolean
  linkedVolunteer: number | null
  backupVolunteer: number | null
  volunteers: User[]
  tarification: number | null
  tarifications: Tarification[]
  description: string | null
}>()

const emit = defineEmits<{
  'update:isDuo': [value: boolean]
  'update:linkedVolunteer': [value: number | null]
  'update:backupVolunteer': [value: number | null]
  'update:tarification': [value: number | null]
  'update:description': [value: string | null]
}>()

const errors = ref<FormError[]>([])
const availabilityWindowInMonths = 3

const filteredVolunteers = computed(() =>
  props.volunteers.filter((v) => v.id !== props.linkedVolunteer),
)

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
})

const startOfDay = (date: Date) => {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

const addDays = (date: Date, days: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

const addMonths = (date: Date, months: number) => {
  const copy = new Date(date)
  copy.setMonth(copy.getMonth() + months)
  return copy
}

const formatShortDate = (date: Date) => dateFormatter.format(date).replace(/\//g, '-')

const volunteerName = (volunteer: User) => volunteer.username

const approvedAbsences = (volunteer: User) =>
  (volunteer.absences ?? [])
    .filter((absence) => absence.absence_status === 'approved' && absence.startDate && absence.endDate)
    .map((absence) => ({
      start: startOfDay(new Date(absence.startDate)),
      end: startOfDay(new Date(absence.endDate!)),
    }))
    .filter((absence) => !Number.isNaN(absence.start.getTime()) && !Number.isNaN(absence.end.getTime()))
    .sort((a, b) => a.start.getTime() - b.start.getTime())

const getAvailabilityPeriods = (volunteer: User) => {
  const today = startOfDay(new Date())
  const absences = approvedAbsences(volunteer).filter((absence) => absence.end >= today)
  const lastAbsenceEnd = absences.reduce<Date | null>(
    (latest, absence) => (!latest || absence.end > latest ? absence.end : latest),
    null,
  )
  const windowEnd = lastAbsenceEnd ? addMonths(lastAbsenceEnd, 1) : addMonths(today, availabilityWindowInMonths)
  const periods: { start: Date; end: Date }[] = []
  let cursor = today

  absences.forEach((absence) => {
    const absenceStart = absence.start < today ? today : absence.start

    if (absenceStart > cursor) {
      periods.push({ start: cursor, end: addDays(absenceStart, -1) })
    }

    if (absence.end >= cursor) {
      cursor = addDays(absence.end, 1)
    }
  })

  if (cursor <= windowEnd) {
    periods.push({ start: cursor, end: windowEnd })
  }

  return periods.slice(0, 2)
}

const selectLinkedVolunteer = (volunteerId: number) => {
  emit('update:linkedVolunteer', volunteerId)
}

const toggleBackupVolunteer = (volunteerId: number) => {
  emit('update:backupVolunteer', props.backupVolunteer === volunteerId ? null : volunteerId)
}

watch(
  () => props.linkedVolunteer,
  (newVal) => {
    if (newVal !== null && newVal === props.backupVolunteer) {
      emit('update:backupVolunteer', null)
    }
  },
)

const validate = (): boolean => {
  errors.value = []
  errors.value.push(
    StringUtils.checkRequiredValidity(
      'linkedVolunteer',
      props.linkedVolunteer?.toString(),
      t('requiredInputError'),
    ),
  )
  errors.value.push(
    StringUtils.checkRequiredValidity(
      'tarification',
      props.tarification?.toString(),
      t('requiredInputError'),
    ),
  )
  return errors.value.filter((x) => x.valid === false).length === 0
}

defineExpose({ validate })
</script>

<template>
  <ToggleSwitchWithLabel
    name="isDuo"
    :modelValue="isDuo"
    @update:modelValue="emit('update:isDuo', $event)"
    :label="$t('admin.cat.isDuo')"
  />
  <div class="mb-2">
    <div class="flex items-start gap-4">
      <label class="font-semibold w-32 shrink-0 pt-1">
        {{ $t('admin.cat.linkedVolunteer') }}<span class="text-red-500 ml-1">*</span>
      </label>
      <div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          type="button"
          class="min-h-20 rounded-md border bg-white px-3 py-2 text-left text-xs transition hover:border-[var(--p-primary-color)]"
          :class="
            volunteer.id === linkedVolunteer
              ? 'border-[var(--p-primary-color)] ring-1 ring-[var(--p-primary-color)]'
              : 'border-gray-200'
          "
          @click="selectLinkedVolunteer(volunteer.id)"
        >
          <span class="mb-1 block truncate text-sm font-semibold text-gray-900">
            {{ volunteerName(volunteer) }}
          </span>
          <span
            v-for="period in getAvailabilityPeriods(volunteer)"
            :key="`${period.start.toISOString()}-${period.end.toISOString()}`"
            class="flex min-w-0 items-center gap-1 leading-5 text-green-700"
          >
            <i class="pi pi-check text-[0.65rem] shrink-0" aria-hidden="true" />
            <span class="truncate">
              Disponible du {{ formatShortDate(period.start) }} au {{ formatShortDate(period.end) }}
            </span>
          </span>
        </button>
      </div>
    </div>
    <Message
      v-if="StringUtils.getFieldError(errors, 'linkedVolunteer')?.valid === false"
      class="mb-2"
      severity="error"
      size="small"
      variant="simple"
    >
      {{ StringUtils.getFieldError(errors, 'linkedVolunteer')?.message }}
    </Message>
  </div>
  <div class="mb-2">
    <div class="flex items-start gap-4">
      <label class="font-semibold w-32 shrink-0 pt-1">
        {{ $t('admin.cat.backupVolunteer') }}
      </label>
      <div class="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          v-for="volunteer in filteredVolunteers"
          :key="volunteer.id"
          type="button"
          class="min-h-20 rounded-md border bg-white px-3 py-2 text-left text-xs transition hover:border-[var(--p-primary-color)]"
          :class="
            volunteer.id === backupVolunteer
              ? 'border-[var(--p-primary-color)] ring-1 ring-[var(--p-primary-color)]'
              : 'border-gray-200'
          "
          @click="toggleBackupVolunteer(volunteer.id)"
        >
          <span class="mb-1 block truncate text-sm font-semibold text-gray-900">
            {{ volunteerName(volunteer) }}
          </span>
          <span
            v-for="period in getAvailabilityPeriods(volunteer)"
            :key="`${period.start.toISOString()}-${period.end.toISOString()}`"
            class="flex min-w-0 items-center gap-1 leading-5 text-green-700"
          >
            <i class="pi pi-check text-[0.65rem] shrink-0" aria-hidden="true" />
            <span class="truncate">
              Disponible du {{ formatShortDate(period.start) }} au {{ formatShortDate(period.end) }}
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
  <SelectWithLabel
    name="tarification"
    :options="tarifications"
    optionLabel="label"
    optionValue="id"
    :modelValue="tarification"
    @update:modelValue="emit('update:tarification', $event ? Number($event) : null)"
    :label="$t('admin.cat.tarification')"
    :placeholder="$t('admin.cat.tarification-placeholder')"
    required
    :valid="StringUtils.getFieldError(errors, 'tarification')?.valid"
    :errorMessage="StringUtils.getFieldError(errors, 'tarification')?.message"
  />
  <div class="flex flex-col gap-1 mt-2">
    <label for="description" class="font-semibold text-sm">{{ $t('admin.cat.description') }}</label>
    <Textarea
      id="description"
      :value="description ?? ''"
      @input="emit('update:description', ($event.target as HTMLTextAreaElement).value || null)"
      rows="4"
      class="w-full"
    />
  </div>
</template>
