<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next'
import type { DateValue } from 'reka-ui'
import { parseDate } from '@internationalized/date'
import { computed, ref } from 'vue'

import { cn } from '@/lib/utils'
import { Button } from '../button'
import { Calendar } from '../calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  id?: string
  class?: string
}>(), {
  modelValue: '',
  placeholder: '设置日期',
  clearable: false,
  disabled: false,
  id: undefined,
  class: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const selectedDate = computed<DateValue | undefined>(() => props.modelValue ? parseDate(props.modelValue) : undefined)
const dateLabel = computed(() => {
  if (!props.modelValue) return props.placeholder
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(`${props.modelValue}T12:00:00`))
})

function selectDate(value: DateValue | undefined) {
  if (!value) return
  emit('update:modelValue', value.toString())
  open.value = false
}

function clearDate() {
  emit('update:modelValue', '')
  open.value = false
}
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        :id="id"
        variant="outline"
        :disabled="disabled"
        :class="cn('w-full justify-start gap-2 text-left font-normal', !modelValue && 'text-[var(--text-tertiary)]', props.class)"
      >
        <CalendarDays class="size-4 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ dateLabel }}</span>
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" class="w-auto rounded-2xl border-[var(--border-subtle)] bg-white p-1 shadow-[var(--shadow-panel)]">
      <Calendar
        :model-value="selectedDate"
        locale="zh-CN"
        :week-starts-on="1"
        layout="month-and-year"
        @update:model-value="selectDate"
      />
      <div v-if="clearable && modelValue" class="border-t border-[var(--border-subtle)] px-2 pb-2 pt-1">
        <Button variant="ghost" size="sm" class="h-auto w-full justify-start px-2 text-[var(--text-secondary)] hover:text-[var(--danger)]" @click="clearDate">
          清除日期
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
