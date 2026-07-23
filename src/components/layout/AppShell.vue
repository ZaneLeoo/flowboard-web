<script setup lang="ts">
import {
  Calendar,
  ChevronUp,
  Folder,
  Inbox,
  LogOut,
  NotebookPen,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  SquareCheckBig,
  Star,
  Sun,
  Target,
  TrendingUp,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

import BrandLogo from '../ui/BrandLogo.vue'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

defineProps<{
  displayName: string
  email: string
}>()

defineEmits<{
  logout: []
}>()

const isCollapsed = ref(false)

const navItemClass = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]'

const mainNavItems = [
  { label: '我的任务', icon: SquareCheckBig },
  { label: '项目', icon: Folder },
  { label: '日历', icon: Calendar },
  { label: '笔记', icon: NotebookPen },
  { label: '目标', icon: Target },
  { label: '习惯', icon: TrendingUp },
]

const secondaryNavItems = [
  { label: '收集箱', icon: Inbox, badge: 3 },
  { label: '已加星', icon: Star, badge: 0 },
]

function comingSoon(label: string) {
  toast(`「${label}」模块即将上线`)
}
</script>

<template>
  <div class="flex h-svh overflow-hidden bg-white">
    <aside
      class="hidden shrink-0 flex-col border-r border-[var(--border-subtle)] bg-white transition-[width] duration-200 lg:flex"
      :class="isCollapsed ? 'w-[4.25rem]' : 'w-60'"
    >
      <div class="flex h-14 shrink-0 items-center" :class="isCollapsed ? 'justify-center px-2' : 'gap-2 px-4'">
        <template v-if="!isCollapsed">
          <RouterLink to="/today" class="flex min-w-0 items-center" aria-label="FlowBoard 首页">
            <BrandLogo size="sm" />
          </RouterLink>
          <button
            type="button"
            class="ml-auto grid size-7 shrink-0 place-items-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]"
            aria-label="折叠侧边栏"
            @click="isCollapsed = true"
          >
            <PanelLeftClose class="size-4" aria-hidden="true" />
          </button>
        </template>
        <button
          v-else
          type="button"
          class="grid size-8 place-items-center rounded-lg text-[var(--text-tertiary)] transition-colors hover:bg-[#f4f4f5] hover:text-[var(--text-primary)]"
          aria-label="展开侧边栏"
          @click="isCollapsed = false"
        >
          <PanelLeftOpen class="size-4" aria-hidden="true" />
        </button>
      </div>

      <nav class="mt-2 grid gap-0.5 px-3" :class="isCollapsed && 'px-2'" aria-label="主导航">
        <RouterLink
          to="/today"
          :class="[navItemClass, isCollapsed && 'justify-center px-0']"
          active-class="bg-[#f4f4f5] font-semibold !text-[var(--accent-primary)]"
        >
          <Sun class="size-[18px] shrink-0" aria-hidden="true" />
          <span v-if="!isCollapsed" class="truncate">今天</span>
        </RouterLink>
        <button
          v-for="item in mainNavItems"
          :key="item.label"
          type="button"
          :class="[navItemClass, isCollapsed && 'justify-center px-0']"
          @click="comingSoon(item.label)"
        >
          <component :is="item.icon" class="size-[18px] shrink-0" aria-hidden="true" />
          <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
        </button>
      </nav>

      <div class="mx-3 my-3 border-t border-[var(--border-subtle)]" />

      <nav class="grid gap-0.5 px-3" :class="isCollapsed && 'px-2'" aria-label="辅助导航">
        <button
          v-for="item in secondaryNavItems"
          :key="item.label"
          type="button"
          :class="[navItemClass, isCollapsed && 'justify-center px-0']"
          @click="comingSoon(item.label)"
        >
          <component :is="item.icon" class="size-[18px] shrink-0" aria-hidden="true" />
          <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
          <span
            v-if="item.badge && !isCollapsed"
            class="ml-auto rounded-md bg-[#ececee] px-1.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]"
          >{{ item.badge }}</span>
        </button>
      </nav>

      <div class="mt-auto px-3 pb-3" :class="isCollapsed && 'px-2'">
        <Popover>
          <PopoverTrigger as-child>
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#f4f4f5]"
              :class="isCollapsed && 'justify-center px-0'"
            >
              <span class="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-xs font-bold text-[var(--accent-primary)]">
                {{ (displayName || '我').slice(0, 1).toUpperCase() }}
              </span>
              <span v-if="!isCollapsed" class="min-w-0 flex-1 truncate text-sm font-medium text-[var(--text-primary)]">{{ displayName }}</span>
              <ChevronUp v-if="!isCollapsed" class="size-4 shrink-0 text-[var(--text-tertiary)]" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            :side-offset="8"
            align="start"
            class="w-56 rounded-xl border-[var(--border-subtle)] bg-white p-1.5 shadow-[var(--shadow-panel)]"
          >
            <p class="truncate px-2.5 py-2 text-xs text-[var(--text-tertiary)]">{{ email }}</p>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
              @click="$emit('logout')"
            >
              <LogOut class="size-4" aria-hidden="true" />
              退出登录
            </button>
          </PopoverContent>
        </Popover>
        <button
          type="button"
          :class="[navItemClass, 'mt-1 w-full', isCollapsed && 'justify-center px-0']"
          @click="comingSoon('设置')"
        >
          <Settings class="size-[18px] shrink-0" aria-hidden="true" />
          <span v-if="!isCollapsed">设置</span>
        </button>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] px-4 lg:hidden">
        <RouterLink to="/today" class="flex items-center" aria-label="FlowBoard 首页">
          <BrandLogo size="sm" />
        </RouterLink>
        <button
          type="button"
          class="grid size-9 place-items-center rounded-full bg-[var(--accent-soft)] text-sm font-bold text-[var(--accent-primary)]"
          aria-label="退出登录"
          @click="$emit('logout')"
        >
          {{ (displayName || '我').slice(0, 1).toUpperCase() }}
        </button>
      </header>
      <slot />
    </div>
  </div>
</template>
