<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import type { ClassValue } from 'clsx'
import type { ButtonHTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold outline-none transition-[transform,background-color,border-color,color,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent-primary)] text-white shadow-[0_10px_24px_rgba(36,99,235,0.22)] hover:bg-[var(--accent-primary-hover)]',
        secondary: 'border border-[var(--border-subtle)] bg-white text-[var(--text-primary)] shadow-[var(--shadow-subtle)] hover:border-[var(--border-strong)] hover:bg-[#fcfcfd]',
        ghost: 'text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]',
        destructive: 'bg-[var(--danger)] text-white shadow-[0_10px_24px_rgba(194,58,66,0.16)] hover:bg-[#aa2e36]',
        outline: 'border border-[var(--border-subtle)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-muted)]',
      },
      size: {
        default: 'min-h-11 px-4',
        sm: 'min-h-9 rounded-lg px-3 text-xs',
        lg: 'min-h-12 px-5',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariants = VariantProps<typeof buttonVariants>

const props = withDefaults(defineProps<{
  type?: ButtonHTMLAttributes['type']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  loading?: boolean
  disabled?: boolean
  class?: ClassValue
}>(), {
  type: 'button',
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
  class: undefined,
})
</script>

<template>
  <button :type="props.type" :class="cn(buttonVariants({ variant: props.variant, size: props.size }), props.class)" :disabled="props.disabled || props.loading">
    <svg v-if="props.loading" class="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="32" stroke-dashoffset="12" /></svg>
    <slot />
  </button>
</template>
