<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
  id: string
  label: string
  type?: 'email' | 'password' | 'text'
  autocomplete?: string
  error?: string
  hint?: string
  disabled?: boolean
}>(), {
  type: 'text',
  autocomplete: 'off',
  error: '',
  hint: '',
  disabled: false,
})
</script>

<template>
  <div class="grid gap-2">
    <Label :for="id">{{ label }}</Label>
    <Input
      :id="id"
      v-model="model"
      :type="type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      :class="error ? 'border-[var(--danger)] ring-4 ring-[var(--danger-soft)]' : 'min-h-12 text-[15px]'"
    />
    <p v-if="error" :id="`${id}-error`" class="text-sm leading-5 text-[var(--danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="text-sm leading-5 text-[var(--text-tertiary)]">{{ hint }}</p>
  </div>
</template>
