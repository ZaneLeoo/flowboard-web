<script lang="ts" setup>
import type { CalendarPrevProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { ChevronLeft } from 'lucide-vue-next'
import { reactiveOmit } from "@vueuse/core"
import { CalendarPrev, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<CalendarPrevProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarPrev
    data-slot="calendar-prev-button"
    :class="cn(
      'inline-flex size-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-white p-0 text-[var(--text-secondary)] opacity-80 transition-[transform,background-color,color] duration-150 hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] active:scale-[0.97]',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronLeft class="size-4" />
    </slot>
  </CalendarPrev>
</template>
