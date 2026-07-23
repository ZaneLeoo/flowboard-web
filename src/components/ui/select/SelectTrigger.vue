<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'
import { SelectIcon, SelectTrigger as SelectTriggerPrimitive } from 'reka-ui'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  class?: string
}>(), {
  class: undefined,
})
</script>

<template>
  <SelectTriggerPrimitive v-bind="$attrs" :class="cn('flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-white px-3.5 py-2 text-left text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-150 data-[placeholder]:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-4 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-50', $props.class)">
    <slot />
    <SelectIcon as-child><ChevronDownIcon class="size-4 shrink-0 text-[var(--text-tertiary)]" /></SelectIcon>
  </SelectTriggerPrimitive>
</template>
