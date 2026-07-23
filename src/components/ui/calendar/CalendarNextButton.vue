<script lang="ts" setup>
import type { CalendarNextProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ChevronRight } from 'lucide-vue-next'
import { reactiveOmit } from "@vueuse/core"
import { CalendarNext, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<CalendarNextProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarNext
    data-slot="calendar-next-button"
    :class="cn(
      'inline-flex size-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white p-0 text-[var(--text-secondary)] opacity-80 transition-[transform,background-color,color] duration-150 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-[0.97]',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronRight class="size-4" />
    </slot>
  </CalendarNext>
</template>
