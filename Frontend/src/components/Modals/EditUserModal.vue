<script setup lang="ts">
import { type User } from '@/models/User'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
const props = defineProps<{
  user: User
  visible: boolean
}>()
const roles = computed(() => userStore.roles)
const selectedRole = ref<string | number>(props.user.role.id)
const emit = defineEmits(['update:visible'])

onMounted(() => {
  loadRoles()
})

const loadRoles = async () => {
  try {
    await userStore.fetchRoles()
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    header="Edit Profile"
    @update:visible="emit('update:visible', false)"
    :style="{ width: '30rem' }"
  >
    <template #header>
      <div class="inline-flex items-center justify-center gap-2">
        <span class="font-bold whitespace-nowrap">{{ props.user.username }}</span>
      </div>
    </template>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
      $t('admin.user-edit-helper')
    }}</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-32">{{ $t('auth.username') }}</label>
      <InputText id="username" class="flex-auto" :value="props.user.username" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-2">
      <label for="email" class="font-semibold w-32">{{ $t('auth.email') }}</label>
      <InputText
        id="email"
        disabled
        v-tooltip.top="$t('admin.user-email-tooltip')"
        class="flex-auto"
        :value="props.user.email"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-4 mb-2">
      <label for="role" class="font-semibold w-32">{{ $t('auth.role') }}</label>
      <Select
        v-model="selectedRole"
        :options="roles"
        optionValue="id"
        optionLabel="name"
        placeholder="Select a Role"
        class="w-full md:w-56"
      />
    </div>
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
        severity="success"
        @click="emit('update:visible', false)"
        autofocus
      />
    </template>
  </Dialog>
</template>
