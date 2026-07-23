<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import AuthFrame from '../components/auth/AuthFrame.vue'
import AppTextField from '../components/ui/AppTextField.vue'
import { Button } from '../components/ui/button'
import { ApiRequestError } from '../lib/http'
import { useAuthStore } from '../stores/auth'

const { t } = useI18n()
const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  displayName: '',
  email: '',
  password: '',
})
const fieldErrors = reactive<Record<string, string>>({})
const formError = ref('')
const isSubmitting = ref(false)

async function submit() {
  clearErrors()
  isSubmitting.value = true
  try {
    await auth.register(form)
    await router.replace('/today')
  }
  catch (error) {
    applyError(error)
  }
  finally {
    isSubmitting.value = false
  }
}

function clearErrors() {
  formError.value = ''
  for (const field of Object.keys(fieldErrors)) {
    delete fieldErrors[field]
  }
}

function applyError(error: unknown) {
  if (error instanceof ApiRequestError) {
    for (const fieldError of error.fieldErrors) {
      fieldErrors[fieldError.field] = fieldError.message
    }
    formError.value = error.fieldErrors.length > 0 ? '' : errorMessage(error.code)
    return
  }
  formError.value = t('auth.errors.network')
}

function errorMessage(code: string) {
  const messages: Record<string, string> = {
    EMAIL_ALREADY_EXISTS: t('auth.errors.emailExists'),
    NETWORK_ERROR: t('auth.errors.network'),
  }
  return messages[code] ?? t('auth.errors.general')
}
</script>

<template>
  <AuthFrame mode="register">
    <div>
      <h2 class="text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-[var(--text-primary)]">{{ t('auth.register.title') }}</h2>
    </div>

    <form class="mt-7 grid gap-5" @submit.prevent="submit">
      <p v-if="formError" class="rounded-xl border border-[var(--danger)] bg-[var(--danger-soft)] px-3.5 py-3 text-sm leading-5 text-[var(--danger)]" role="alert">
        {{ formError }}
      </p>
      <AppTextField id="register-name" v-model="form.displayName" autocomplete="name" :label="t('auth.fields.displayName')" :error="fieldErrors.displayName" />
      <AppTextField id="register-email" v-model="form.email" type="email" autocomplete="email" :label="t('auth.fields.email')" :error="fieldErrors.email" />
      <AppTextField id="register-password" v-model="form.password" type="password" autocomplete="new-password" :label="t('auth.fields.password')" :hint="t('auth.fields.passwordHint')" :error="fieldErrors.password" />
      <Button type="submit" :loading="isSubmitting" class="mt-1 w-full">
        <Icon v-if="!isSubmitting" icon="solar:arrow-right-linear" class="size-4" aria-hidden="true" />
        {{ t('auth.register.submit') }}
      </Button>
    </form>
  </AuthFrame>
</template>
