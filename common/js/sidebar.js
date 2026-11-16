/**
 * 左侧导航栏折叠状态（全局共享）
 * ============================================================
 * 每个页面都会挂一个 PageLayout，所以状态必须放在模块级共享，
 * 不然从 A 页跳到 B 页会各算各的、侧栏又弹回来。
 * 同时写进 Storage，刷新浏览器也能记住。
 */
import { ref } from 'vue'

const STORAGE_KEY = 'sidebarCollapsed'

export const sidebarCollapsed = ref(uni.getStorageSync(STORAGE_KEY) === true)

export function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  uni.setStorageSync(STORAGE_KEY, sidebarCollapsed.value)
}

export function setSidebarCollapsed(val) {
  sidebarCollapsed.value = !!val
  uni.setStorageSync(STORAGE_KEY, sidebarCollapsed.value)
}