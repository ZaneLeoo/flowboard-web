<script setup lang="ts">
import { Icon } from '@iconify/vue'

withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  disabled?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  loading: false,
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-[transform,background-color,box-shadow,color] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
    :class="{
      'bg-[var(--accent-primary)] text-white shadow-[0_10px_24px_rgba(36,99,235,0.24)] hover:bg-[var(--accent-primary-hover)]': variant === 'primary',
      'border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-subtle)] hover:border-[var(--border-strong)] hover:bg-white': variant === 'secondary',
      'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]': variant === 'ghost',
    }"
  >
    <Icon v-if="loading" icon="solar:refresh-circle-linear" class="size-4 animate-spin" aria-hidden="true" />
    <slot />
  </button>
</template>
