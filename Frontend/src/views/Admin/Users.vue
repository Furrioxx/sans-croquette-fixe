<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/users'
import UserModal from '@/components/Modals/UserModal.vue'

const userStore = useUserStore()

const loading = ref<boolean>(false)
const op = ref()
const editModalVisible = ref<boolean>(false)
const selectedUserId = ref<number | null>(null)

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

const togglePopover = (event: any, userId: number) => {
  op.value.toggle(event)
  selectedUserId.value = userId
}

const editUser = async () => {
  try {
    await userStore.fetchUserById(selectedUserId.value!)
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
  <UserModal
    :user="selectedUser"
    :visible="editModalVisible"
    @update:visible="closeModal($event)"
    @update:datas="loadData"
  />

  <Button
    class="mb-3"
    :label="$t('admin.user-create')"
    icon="pi pi-plus"
    iconPos="right"
    @click="editModalVisible = true"
  />

  <div class="admin-table-shell">
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
      <Column header="Blocked">
        <template #body="slotProps">
          <i class="pi pi-check-circle text-green-500" v-if="slotProps.data.blocked"></i>
          <i class="pi pi-times-circle text-red-500" v-else></i>
        </template>
      </Column>
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
            icon="pi pi-ellipsis-v"
            rounded
            text
            v-tooltip.top="$t('settings')"
            @click="togglePopover($event, slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>

  <Popover ref="op">
    <div class="flex flex-col gap-4">
      <li class="btn-bis text-gray-600 hover:text-gray-900" @click="editUser">
        <i class="pi pi-pencil"></i>
        <span>{{ $t('update') }}</span>
      </li>

      <li class="btn-bis text-red-600 hover:text-red-800" @click="">
        <i class="pi pi-lock"></i>
        <span>{{ $t('admin.block-user') }}</span>
      </li>
    </div>
  </Popover>
</template>
