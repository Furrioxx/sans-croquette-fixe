<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CatSheetModal from '@/components/Modals/CatSheetModal.vue'
import { useCatStore } from '@/stores/cats'
import { Genders } from '@/models/Enums/Genders'

const catStore = useCatStore()
const loading = ref<boolean>(false)
const op = ref()
const editModalVisible = ref<boolean>(false)
const selectedCatId = ref<number | null>(null)

const cats = computed(() => catStore.cats)
const selectedCat = computed(() => catStore.selectedCat)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    await catStore.fectchCats()
  } catch (error) {
    console.error('Error fetching cats:', error)
  } finally {
    loading.value = false
  }
}

const togglePopover = (event: any, catId: number) => {
  op.value.toggle(event)
  selectedCatId.value = catId
}

const editCat = () => {
  catStore.selectedCat = cats.value.find((c) => c.id === selectedCatId.value) ?? null
  editModalVisible.value = true
}

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
  catStore.selectedCat = null
}

const getGenderSeverity = (gender: Genders) => {
  switch (gender) {
    case Genders.MALE:
      return 'info'
    case Genders.FEMALE:
      return 'warn'
    default:
      return 'secondary'
  }
}

const getGenderLabel = (gender: Genders) => {
  switch (gender) {
    case Genders.MALE:
      return 'Mâle'
    case Genders.FEMALE:
      return 'Femelle'
    default:
      return 'Non déterminé'
  }
}
</script>

<template>
  <CatSheetModal
    :cat="selectedCat"
    :visible="editModalVisible"
    @update:visible="closeModal($event)"
    @update:datas="loadData"
  />

  <Button
    class="mb-3"
    :label="$t('admin.cat.cat-create')"
    icon="pi pi-plus"
    iconPos="right"
    @click="editModalVisible = true"
  />

  <DataTable :value="cats" :loading="loading" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">{{ $t('admin.cat.cats') }}</span>
        <Button
          icon="pi pi-refresh"
          v-tooltip.top="$t('refresh')"
          rounded
          raised
          @click="loadData"
        />
      </div>
    </template>

    <Column field="name" :header="$t('admin.cat.name')"></Column>

    <Column :header="$t('admin.cat.gender')">
      <template #body="slotProps">
        <Tag
          :value="getGenderLabel(slotProps.data.gender)"
          :severity="getGenderSeverity(slotProps.data.gender)"
        />
      </template>
    </Column>

    <Column field="age" :header="$t('admin.cat.age')"></Column>

    <Column field="birthDate" :header="$t('admin.cat.birthDate')"></Column>

    <Column :header="$t('admin.cat.vaccinated')">
      <template #body="slotProps">
        <i class="pi pi-check-circle text-green-500" v-if="slotProps.data.vaccinated"></i>
        <i class="pi pi-times-circle text-red-500" v-else></i>
      </template>
    </Column>

    <Column :header="$t('admin.cat.sterilized')">
      <template #body="slotProps">
        <i class="pi pi-check-circle text-green-500" v-if="slotProps.data.sterilized"></i>
        <i class="pi pi-times-circle text-red-500" v-else></i>
      </template>
    </Column>

    <Column :header="$t('admin.cat.isDuo')">
      <template #body="slotProps">
        <i class="pi pi-heart-fill text-pink-500" v-if="slotProps.data.isDuo"></i>
        <i class="pi pi-minus text-gray-400" v-else></i>
      </template>
    </Column>

    <Column :header="$t('admin.cat.mood')">
      <template #body="slotProps">
        <div class="flex flex-wrap gap-1">
          <Tag
            v-for="mood in slotProps.data.cat_moods"
            :key="mood.id"
            :value="mood.name"
            severity="secondary"
          />
        </div>
      </template>
    </Column>

    <Column :header="$t('actions')">
      <template #body="slotProps">
        <Button
          icon="pi pi-ellipsis-v"
          rounded
          text
          v-tooltip.top="$t('settings')"
          @click="togglePopover($event, slotProps.data.id)"
        />
      </template>
    </Column>
  </DataTable>

  <Popover ref="op">
    <div class="flex flex-col gap-4">
      <li class="btn-bis text-gray-600 hover:text-gray-900" @click="editCat">
        <i class="pi pi-pencil"></i>
        <span>{{ $t('update') }}</span>
      </li>
    </div>
  </Popover>
</template>
