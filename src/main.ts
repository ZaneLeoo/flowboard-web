import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { i18n } from './locales'
import { router } from './router'
import { installRouterGuards } from './router'

const pinia = createPinia()
installRouterGuards(pinia)

createApp(App).use(pinia).use(i18n).use(router).mount('#app')
