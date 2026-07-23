<script setup lang="ts">
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
    <label :for="id" class="text-sm font-semibold text-[var(--text-primary)]">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :aria-invalid="Boolean(error)"
      :aria-describedby="error ? `${id}-error` : hint ? `${id}-hint` : undefined"
      class="min-h-12 w-full rounded-xl border bg-white px-3.5 text-[15px] text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--text-tertiary)] disabled:cursor-not-allowed disabled:bg-[var(--surface-muted)]"
      :class="error ? 'border-[var(--danger)] shadow-[0_0_0_3px_var(--danger-soft)]' : 'border-[var(--border-subtle)] focus:border-[var(--accent-primary)] focus:shadow-[0_0_0_3px_var(--accent-soft)]'"
    >
    <p v-if="error" :id="`${id}-error`" class="text-sm leading-5 text-[var(--danger)]">{{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="text-sm leading-5 text-[var(--text-tertiary)]">{{ hint }}</p>
  </div>
</template>
