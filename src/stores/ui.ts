import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isTaskPanelOpen: false,
  }),
  actions: {
    openTaskPanel() {
      this.isTaskPanelOpen = true
    },
    closeTaskPanel() {
      this.isTaskPanelOpen = false
    },
  },
})
