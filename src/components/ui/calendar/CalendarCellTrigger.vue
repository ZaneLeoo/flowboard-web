<script lang="ts" setup>
import type { CalendarCellTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { CalendarCellTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>(), {
  as: "button",
})

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    data-slot="calendar-cell-trigger"
    :class="cn(
      'inline-flex size-8 cursor-default items-center justify-center rounded-lg p-0 text-sm font-medium text-[var(--text-primary)] transition-[transform,background-color,color] duration-150 hover:bg-[var(--surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-1 active:scale-[0.97] aria-selected:opacity-100',
      '[&[data-today]:not([data-selected])]:bg-[var(--accent-soft)] [&[data-today]:not([data-selected])]:text-[var(--accent-primary)]',
      // Selected
      'data-[selected]:bg-[var(--accent-primary)] data-[selected]:text-white data-[selected]:opacity-100 [&[data-selected]:hover]:bg-[var(--accent-primary-hover)] data-[selected]:hover:text-white data-[selected]:focus:bg-[var(--accent-primary)] data-[selected]:focus:text-white',
      // Disabled
      'data-[disabled]:text-[var(--text-tertiary)] data-[disabled]:opacity-50',
      // Unavailable
      'data-[unavailable]:text-[var(--danger)] data-[unavailable]:line-through',
      // Outside months
      'data-[outside-view]:text-[var(--text-tertiary)]',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
