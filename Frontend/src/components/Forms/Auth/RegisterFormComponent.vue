<script setup lang="ts">
import type { UserPost } from '@/models/User'
import { useAuthStore } from '@/stores/authentication'
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/routeNames'

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const userPost = reactive<UserPost>({
  username: '',
  email: '',
  password: '',
})
const loading = ref<boolean>(false)
const errorMessage = ref<string>()
const error = ref<boolean>(false)
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordValue = computed(() => userPost.password ?? '')

const passwordRules = computed(() => [
  {
    label: t('auth.password-rules.uppercase'),
    valid: /[A-Z]/.test(passwordValue.value),
  },
  {
    label: t('auth.password-rules.number'),
    valid: /\d/.test(passwordValue.value),
  },
  {
    label: t('auth.password-rules.special'),
    valid: /[^A-Za-z0-9]/.test(passwordValue.value),
  },
  {
    label: t('auth.password-rules.match'),
    valid: passwordValue.value.length > 0 && passwordValue.value === confirmPassword.value,
  },
])

const isRegisterFormValid = computed(() => passwordRules.value.every((rule) => rule.valid))

const onSubmit = async () => {
  if (!isRegisterFormValid.value) {
    errorMessage.value = t('auth.password-rules-error')
    error.value = true
    return
  }

  try {
    loading.value = true
    error.value = false
    await authStore.register(userPost)
  } catch (err: Error | any) {
    errorMessage.value = t('auth.registerFail')
    error.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-form-shell">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
      <div class="space-y-2">
        <label for="register-email" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.email') }}
        </label>
        <InputText
          id="register-email"
          v-model="userPost.email"
          type="email"
          :placeholder="$t('auth.email-placeholder')"
          class="auth-input"
          autocomplete="email"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="register-username" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.username') }}
        </label>
        <InputText
          id="register-username"
          v-model="userPost.username"
          type="text"
          :placeholder="$t('auth.username-placeholder')"
          class="auth-input"
          autocomplete="username"
          required
        />
      </div>

      <div class="space-y-2">
        <label for="register-password" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.password') }}
        </label>
        <div class="auth-password-field">
          <InputText
            id="register-password"
            v-model="userPost.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="$t('auth.password-placeholder')"
            class="auth-input pr-12"
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="auth-password-toggle"
            :aria-label="showPassword ? $t('auth.hide-password') : $t('auth.show-password')"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <label for="register-password-confirm" class="text-sm font-semibold text-[var(--scf-ink)]">
          {{ $t('auth.password-confirm') }}
        </label>
        <div class="auth-password-field">
          <InputText
            id="register-password-confirm"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('auth.password-confirm-placeholder')"
            class="auth-input pr-12"
            autocomplete="new-password"
            required
          />
          <button
            type="button"
            class="auth-password-toggle"
            :aria-label="showConfirmPassword ? $t('auth.hide-password') : $t('auth.show-password')"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>
      </div>

      <div class="auth-password-rules">
        <div
          v-for="rule in passwordRules"
          :key="rule.label"
          class="auth-password-rule"
          :class="{ 'is-valid': rule.valid }"
        >
          <i :class="rule.valid ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
          <span>{{ rule.label }}</span>
        </div>
      </div>

      <Message v-if="error" severity="error" class="rounded-2xl">{{ errorMessage }}</Message>

      <Button
        :label="$t('register')"
        :loading="loading"
        type="submit"
        icon="pi pi-heart-fill"
        class="auth-submit-btn"
        :disabled="!isRegisterFormValid"
      />
    </form>

    <div class="auth-form-footer">
      <p>{{ $t('auth.alreadyAccount') }}</p>
      <button
        type="button"
        class="font-semibold text-[var(--scf-accent-dark)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
        @click="router.push({ name: RouteNames.LOGIN })"
      >
        {{ $t('login') }}
      </button>
    </div>
  </div>
</template>
