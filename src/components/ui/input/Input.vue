<script setup lang="ts">
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const model = defineModel<string | number>()

withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})
</script>

<template>
  <input v-model="model" v-bind="$attrs" :class="cn('flex min-h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 py-2 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50', $props.class)">
</template>
