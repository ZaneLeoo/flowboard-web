<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

import { cn } from '@/lib/utils'

const model = defineModel<boolean>({ default: false })

withDefaults(defineProps<{
  disabled?: boolean
  class?: string
}>(), {
  disabled: false,
  class: undefined,
})
</script>

<template>
  <CheckboxRoot v-model="model" :disabled="disabled" :class="cn('grid size-4 shrink-0 place-items-center rounded-[5px] border border-[var(--border-strong)] bg-white text-white outline-none transition-[transform,background-color,border-color] duration-150 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 active:scale-90 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--accent-primary)] data-[state=checked]:bg-[var(--accent-primary)]', $props.class)">
    <CheckboxIndicator class="grid place-items-center"><CheckIcon class="size-3" stroke-width="3" /></CheckboxIndicator>
  </CheckboxRoot>
</template>
