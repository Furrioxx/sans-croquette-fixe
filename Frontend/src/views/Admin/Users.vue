<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { Roles } from '@/router/Roles'

const router = useRouter()
const userStore = useUserStore()

const loading = ref<boolean>(false)

const users = computed(() => userStore.users)

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

const getRoleSeverity = (roleName: string) => {
  switch (roleName) {
    case Roles.ADMIN:
      return 'danger'
    case Roles.VOLUNTEER:
      return 'warn'
    case Roles.USER:
      return 'info'
    default:
      return 'success'
  }
}
</script>
<template>
  <Button class="mb-3" :label="$t('admin.user-create')" icon="pi pi-plus" iconPos="right" />

  <DataTable :value="users" :loading="loading" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="text-xl font-bold">Users</span>
        <Button icon="pi pi-refresh" rounded raised @click="loadData" />
      </div>
    </template>
    <Column field="username" header="Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column header="Role">
      <template #body="slotProps">
        <Tag
          :value="slotProps.data.role.name"
          :severity="getRoleSeverity(slotProps.data.role.type)"
        />
      </template>
    </Column>
  </DataTable>
</template>
