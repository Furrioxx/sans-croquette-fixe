<script setup lang="ts">
import { type User, type UserPostPutAdmin } from '@/models/User'
import { computed, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import { useI18n } from 'vue-i18n'
import InputTextWithLabel from '../Forms/elements/InputTextWithLabel.vue'
import ToggleSwitchWithLabel from '../Forms/elements/ToggleSwitchWithLabel.vue'
import SelectWithLabel from '../Forms/elements/SelectWithLabel.vue'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'

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
const errors = ref<FormError[]>([])
const form = ref<UserPostPutAdmin>({
  id: props.user?.id || null,
  username: props.user?.username || '',
  email: props.user?.email || '',
  password: '',
  confirmed: props.user?.confirmed || false,
  blocked: props.user?.blocked || false,
  role: props.user?.role.id || 4,
})

const resetForm = () => {
  form.value = {
    id: props.user?.id || null,
    username: props.user?.username || '',
    email: props.user?.email || '',
    password: '',
    confirmed: props.user?.confirmed || false,
    blocked: props.user?.blocked || false,
    role: props.user?.role.id || 4,
  }
  errors.value = []
}

watch(() => props.user, resetForm)

onMounted(() => {
  resetForm()
  loadRoles()
})

const loadRoles = async () => {
  try {
    await userStore.fetchRoles()
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const checkValidity = () => {
  errors.value = []
  errors.value.push(
    StringUtils.checkInputTextValidity('username', form.value.username, t('requiredInputError'), 4),
  )
  errors.value.push(
    StringUtils.checkInputTextValidity('email', form.value.email, t('requiredInputError')),
  )

  if (errors.value.filter((x) => x.valid == false).length > 0) {
    return false
  }
  return true
}

const save = async () => {
  const valid = checkValidity()
  console.log(form.value)

  // if (valid) {
  //   if (isEditMode.value) {
  //     await userStore.updateUserAdmin(form.value)
  //   } else {
  //     await userStore.addUserAdmin(form.value)
  //   }
  //   emit('update:visible', false)
  //   emit('update:datas')
  // }
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

    <InputTextWithLabel
      name="username"
      :label="$t('auth.username')"
      v-model="form.username"
      :valid="StringUtils.getFieldError(errors, 'username')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'username')?.message"
    />
    <InputTextWithLabel
      name="email"
      :label="$t('auth.email')"
      v-model="form.email"
      :tooltip="$t('admin.user-email-tooltip')"
      :disabled="isEditMode"
      type="email"
      :valid="StringUtils.getFieldError(errors, 'email')?.valid"
      :errorMessage="StringUtils.getFieldError(errors, 'email')?.message"
    />
    <SelectWithLabel
      name="ol"
      :options="roles"
      optionLabel="name"
      optionValue="id"
      v-model="form.role"
      :label="$t('auth.role')"
    />
    <div v-if="!isEditMode">
      <!-- TODO Remove this field -->
      <InputTextWithLabel name="password" :label="$t('auth.password')" v-model="form.password!" />

      <ToggleSwitchWithLabel
        name="confirmed"
        v-model="form.confirmed"
        :label="$t('auth.confirmed')"
      />

      <ToggleSwitchWithLabel name="blocked" v-model="form.blocked" :label="$t('auth.blocked')" />
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
        type="submit"
        severity="success"
        autofocus
        @click="save"
      />
    </template>
  </Dialog>
</template>
