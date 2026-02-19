<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/users'
import EditUserModal from '@/components/Modals/EditUserModal.vue'

const userStore = useUserStore()

const loading = ref<boolean>(false)
const editModalVisible = ref<boolean>(false)

const users = computed(() => userStore.users)
const selectedUser = computed(() => userStore.selectedUser)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const editUser = async (userId: number) => {
  try {
    userStore.fetchUserById(userId)
    editModalVisible.value = true
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
  userStore.selectedUser = null
}
</script>
<template>
  <EditUserModal
    v-if="selectedUser != null"
    :user="selectedUser"
    :visible="editModalVisible"
    @update:visible="closeModal($event)"
  />

  <Button class="mb-3" :label="$t('admin.user-create')" icon="pi pi-plus" iconPos="right" />

  <DataTable :value="users" :loading="loading" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">{{ $t('admin.users') }}</span>
        <Button
          icon="pi pi-refresh"
          v-tooltip.top="$t('refresh')"
          rounded
          raised
          @click="loadData"
        />
      </div>
    </template>
    <Column field="username" header="Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column header="Role">
      <template #body="slotProps">
        <Tag
          :value="slotProps.data.role.name"
          :severity="userStore.getRoleSeverity(slotProps.data.role.type)"
        />
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          v-tooltip.top="$t('update')"
          @click="editUser(slotProps.data.id)"
        />
      </template>
    </Column>
  </DataTable>
</template>
