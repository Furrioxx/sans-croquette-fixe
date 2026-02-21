<script setup lang="ts">
import { type User, type UserPostPutAdmin } from '@/models/User'
import { computed, onMounted, reactive, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const userStore = useUserStore()
const emit = defineEmits(['update:visible', 'update:datas'])

const props = defineProps<{
  user: User | null
  visible: boolean
}>()

const roles = computed(() => userStore.roles)
const header = computed(() => (props.user ? props.user.username : t('admin.user-create')))
const isEditMode = computed<boolean>(() => !!props.user)

const form = reactive<UserPostPutAdmin>({
  id: props.user?.id || null,
  username: props.user?.username || '',
  email: props.user?.email || '',
  password: null,
  confirmed: props.user?.confirmed || false,
  blocked: props.user?.blocked || false,
  role: props.user?.role.id || 4,
})

watch(
  () => props.user,
  (newUser) => {
    form.id = newUser?.id || null
    form.username = newUser?.username || ''
    form.email = newUser?.email || ''
    form.confirmed = newUser?.confirmed || false
    form.blocked = newUser?.blocked || false
    form.role = newUser?.role.id || 4
  },
)

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

const save = async () => {
  if (isEditMode.value) {
    await userStore.updateUserAdmin(form)
  } else {
    await userStore.addUserAdmin(form)
  }
  emit('update:visible', false)
  emit('update:datas')
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
        <span class="font-bold whitespace-nowrap">{{ header }}</span>
      </div>
    </template>
    <span class="text-surface-500 dark:text-surface-400 block mb-4">{{
      $t('admin.user-edit-helper')
    }}</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="username" class="font-semibold w-32">{{ $t('auth.username') }}</label>
      <InputText id="username" class="flex-auto" v-model="form.username" autocomplete="off" />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="email" class="font-semibold w-32">{{ $t('auth.email') }}</label>
      <InputText
        id="email"
        :disabled="isEditMode"
        v-tooltip.top="$t('admin.user-email-tooltip')"
        class="flex-auto"
        v-model="form.email"
        autocomplete="off"
      />
    </div>
    <div class="flex items-center gap-4 mb-2">
      <label for="role" class="font-semibold w-32">{{ $t('auth.role') }}</label>
      <Select
        id="role"
        v-model="form.role"
        :options="roles"
        optionValue="id"
        optionLabel="name"
        placeholder="Select a Role"
        class="flex-auto"
      />
    </div>
    <div v-if="!isEditMode">
      <!-- TODO Remove this field -->
      <div class="flex items-center gap-4 mb-4">
        <label for="password" class="font-semibold w-32">{{ $t('auth.password') }}</label>
        <InputText id="password" class="flex-auto" v-model="form.password" autocomplete="off" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="confirmed" class="font-semibold w-32">{{ $t('auth.confirmed') }}</label>
        <ToggleSwitch id="confirmed" v-model="form.confirmed" />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="blocked" class="font-semibold w-32">{{ $t('auth.blocked') }}</label>
        <ToggleSwitch id="blocked" v-model="form.blocked" />
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('cancel')"
        text
        severity="secondary"
        @click="emit('update:visible', false)"
        autofocus
      />
      <Button :label="$t('save')" variant="outlined" severity="success" @click="save" autofocus />
    </template>
  </Dialog>
</template>
