<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'
import { SelectItem as SelectItemPrimitive, SelectItemIndicator, SelectItemText } from 'reka-ui'

import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

withDefaults(defineProps<{
  value: string
  class?: string
}>(), {
  class: undefined,
})
</script>

<template>
  <SelectItemPrimitive :value="$props.value" v-bind="$attrs" :class="cn('relative flex min-h-9 w-full cursor-default select-none items-center rounded-lg py-1.5 pl-3 pr-8 text-sm text-[var(--text-primary)] outline-none data-[highlighted]:bg-[var(--accent-soft)] data-[highlighted]:text-[var(--accent-primary)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50', $props.class)">
    <SelectItemText><slot /></SelectItemText>
    <span class="absolute right-2 grid size-4 place-items-center"><SelectItemIndicator><CheckIcon class="size-3.5" stroke-width="2.5" /></SelectItemIndicator></span>
  </SelectItemPrimitive>
</template>
